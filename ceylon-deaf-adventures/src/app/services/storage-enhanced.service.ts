import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTaskSnapshot } from '@angular/fire/storage';
import { Observable, Subject, throwError, from } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: string;
  state?: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

@Injectable({ providedIn: 'root' })
export class StorageEnhancedService {
  private storage = inject(Storage);
  private readonly UPLOAD_TIMEOUT = 120000; // 2 minutes
  private readonly MAX_RETRIES = 3;

  /**
   * Upload a file to Firebase Storage with progress tracking and error handling
   */
  uploadFile(path: string, file: File): Observable<UploadProgress> {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const progress$ = new Subject<UploadProgress>();

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        // Calculate progress percentage
        const percentComplete = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        progress$.next({
          progress: Math.round(percentComplete),
          state: snapshot.state as any
        });

        console.log(`Upload progress for ${file.name}: ${Math.round(percentComplete)}%`);
      },
      (error: any) => {
        // Handle upload errors
        console.error('Upload error:', error);
        const errorMessage = this.handleStorageError(error);

        progress$.next({
          progress: 0,
          state: 'error',
          error: errorMessage
        });

        progress$.error(new Error(errorMessage));
      },
      async () => {
        // Upload completed successfully
        try {
          console.log(`Upload complete for ${file.name}, getting download URL...`);
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          progress$.next({
            progress: 100,
            state: 'success',
            downloadURL
          });

          progress$.complete();
        } catch (error: any) {
          console.error('Error getting download URL:', error);
          const errorMessage = this.handleStorageError(error);

          progress$.next({
            progress: 100,
            state: 'error',
            error: errorMessage
          });

          progress$.error(new Error(errorMessage));
        }
      }
    );

    return progress$.asObservable();
  }

  /**
   * Upload file with retry logic and timeout
   */
  async uploadFileWithRetry(path: string, file: File, maxRetries: number = this.MAX_RETRIES): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Upload attempt ${attempt}/${maxRetries} for ${file.name}`);

        const downloadURL = await this.performUpload(path, file);
        console.log(`✅ Upload successful on attempt ${attempt}`);
        return downloadURL;

      } catch (error: any) {
        lastError = error;
        console.warn(`❌ Upload attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          // Wait before retrying with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
        }
      }
    }

    // All attempts failed
    throw new Error(
      `Failed to upload ${file.name} after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Perform a single upload attempt
   */
  private async performUpload(path: string, file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const timeoutId = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('Upload timeout exceeded'));
      }, this.UPLOAD_TIMEOUT);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${Math.round(progress)}%`);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(this.createStorageError(error));
        },
        async () => {
          clearTimeout(timeoutId);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error: any) {
            reject(this.createStorageError(error));
          }
        }
      );
    });
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(downloadURL: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, downloadURL);
      await deleteObject(storageRef);
      console.log('File deleted successfully');
    } catch (error: any) {
      console.error('Error deleting file:', error);
      throw this.createStorageError(error);
    }
  }

  /**
   * Get download URL for a file
   */
  async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      throw this.createStorageError(error);
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, maxSizeMB: number = 10, allowedTypes: string[] = ['image/']): { valid: boolean; error?: string } {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
      };
    }

    // Check file type
    const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isAllowedType) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Handle storage errors and return user-friendly messages
   */
  private handleStorageError(error: any): string {
    console.error('Storage error details:', {
      code: error?.code,
      message: error?.message,
      serverResponse: error?.serverResponse,
      customData: error?.customData
    });

    if (error?.code) {
      switch (error.code) {
        case 'storage/unauthorized':
          return 'Upload failed: You do not have permission to upload files. Please check Firebase Storage security rules.';

        case 'storage/canceled':
          return 'Upload was cancelled.';

        case 'storage/unknown':
          // Check for more specific error information
          if (error.serverResponse) {
            console.error('Server response:', error.serverResponse);
            return `Upload failed: ${error.serverResponse}. Please check Firebase Storage configuration and security rules.`;
          }
          return 'Upload failed due to an unknown error. Please check your Firebase Storage configuration, security rules, and ensure the storage bucket exists.';

        case 'storage/object-not-found':
          return 'File not found in storage.';

        case 'storage/bucket-not-found':
          return 'Storage bucket not found. Please check Firebase configuration.';

        case 'storage/project-not-found':
          return 'Firebase project not found. Please check configuration.';

        case 'storage/quota-exceeded':
          return 'Storage quota exceeded. Please upgrade your Firebase plan.';

        case 'storage/unauthenticated':
          return 'Authentication required. Please sign in first.';

        case 'storage/retry-limit-exceeded':
          return 'Upload failed after multiple retries. Please check your connection and try again.';

        case 'storage/invalid-checksum':
          return 'File upload corrupted. Please try again.';

        case 'storage/server-file-wrong-size':
          return 'File size mismatch. Please try uploading again.';

        default:
          return `Upload error: ${error.code} - ${error.message}`;
      }
    }

    return error?.message || 'An unknown upload error occurred';
  }

  /**
   * Create a standardized storage error
   */
  private createStorageError(error: any): Error {
    const message = this.handleStorageError(error);
    const err = new Error(message);
    (err as any).originalError = error;
    return err;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if storage is configured correctly
   */
  async testStorageConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Testing Firebase Storage connection...');

      // Create a test file
      const testData = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testData], 'test.txt', { type: 'text/plain' });

      // Try to upload
      const testPath = `connection-test/${Date.now()}_test.txt`;
      const downloadURL = await this.uploadFileWithRetry(testPath, testFile, 1);

      // Try to delete
      const storageRef = ref(this.storage, testPath);
      await deleteObject(storageRef);

      return {
        success: true,
        message: 'Firebase Storage is configured correctly and working!'
      };

    } catch (error: any) {
      console.error('Storage connection test failed:', error);
      return {
        success: false,
        message: `Storage test failed: ${error.message}`
      };
    }
  }
}
