import { Injectable, inject, OnDestroy } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    collectionData,
    docData,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    Query,
    CollectionReference,
    serverTimestamp,
    connectFirestoreEmulator,
    enableNetwork,
    disableNetwork,
    onSnapshot,
    Unsubscribe,
    terminate,
    waitForPendingWrites
} from '@angular/fire/firestore';
import { Observable, from, throwError, BehaviorSubject, Subject, timer } from 'rxjs';
import { map, retry, catchError, timeout, takeUntil, finalize, switchMap, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirestoreService implements OnDestroy {
    private firestore = inject(Firestore);
    private isInitialized = false;
    private destroy$ = new Subject<void>();
    private activeListeners = new Set<Unsubscribe>();
    private connectionStatus = new BehaviorSubject<'connected' | 'disconnected' | 'error' | 'reconnecting'>('disconnected');
    private reconnectionAttempts = 0;
    private maxReconnectionAttempts = 5;
    private isReconnecting = false;
    
    public connectionStatus$ = this.connectionStatus.asObservable();

    constructor() {
        // Delay initialization to ensure proper injection context
        setTimeout(() => {
            this.initializeFirestore();
            this.setupConnectionMonitoring();
        }, 100);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.cleanupAllListeners();
        this.connectionStatus.complete();
    }

    private setupConnectionMonitoring() {
        // Monitor connection status every 30 seconds
        timer(0, 30000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.checkConnectionHealth();
            });
    }

    private async checkConnectionHealth() {
        try {
            if (this.isInitialized) {
                // Try a simple operation to check if connection is healthy
                await waitForPendingWrites(this.firestore);
                if (this.connectionStatus.value !== 'connected') {
                    this.connectionStatus.next('connected');
                    this.reconnectionAttempts = 0;
                }
            }
        } catch (error: any) {
            console.warn('Connection health check failed:', error);
            if (error.message?.includes('INTERNAL ASSERTION FAILED') || 
                error.code === 'internal' || 
                error.code === 'unavailable') {
                this.handleConnectionError(error);
            }
        }
    }

    private async handleConnectionError(error: any) {
        if (this.isReconnecting) return;
        
        this.isReconnecting = true;
        this.connectionStatus.next('reconnecting');
        
        try {
            // Clean up existing connections
            this.cleanupAllListeners();
            
            // Wait a bit before attempting reconnection
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Try to disable and re-enable network
            await this.reconnectFirestore();
            
        } catch (reconnectError) {
            console.error('Reconnection failed:', reconnectError);
            this.connectionStatus.next('error');
        } finally {
            this.isReconnecting = false;
        }
    }

    private async reconnectFirestore() {
        try {
            if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
                this.reconnectionAttempts++;
                console.log(`Reconnection attempt ${this.reconnectionAttempts}/${this.maxReconnectionAttempts}`);
                
                // Clean up all active listeners first to prevent conflicts
                this.cleanupAllListeners();
                
                // Wait for cleanup to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Disable network to force cleanup of internal state
                await disableNetwork(this.firestore);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Re-enable network with fresh state
                await enableNetwork(this.firestore);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Test connection with a simple operation
                await waitForPendingWrites(this.firestore);
                
                this.connectionStatus.next('connected');
                this.reconnectionAttempts = 0;
                console.log('Firestore reconnection successful');
            } else {
                throw new Error('Max reconnection attempts reached');
            }
        } catch (error) {
            console.error('Firestore reconnection failed:', error);
            throw error;
        }
    }

    private cleanupAllListeners() {
        this.activeListeners.forEach(unsubscribe => {
            try {
                unsubscribe();
            } catch (error) {
                console.warn('Error cleaning up listener:', error);
            }
        });
        this.activeListeners.clear();
    }

    // Public method to force reconnection
    async forceReconnect(): Promise<void> {
        console.log('Force reconnection requested');
        await this.handleConnectionError(new Error('Manual reconnection'));
    }

    // Public method to get current connection status
    getConnectionStatus(): 'connected' | 'disconnected' | 'error' | 'reconnecting' {
        return this.connectionStatus.value;
    }

    // Public method to wait for connection
    async waitForConnection(timeoutMs: number = 30000): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.connectionStatus.value === 'connected') {
                resolve();
                return;
            }

            const timeout = setTimeout(() => {
                subscription.unsubscribe();
                reject(new Error('Connection timeout'));
            }, timeoutMs);

            const subscription = this.connectionStatus$.subscribe(status => {
                if (status === 'connected') {
                    clearTimeout(timeout);
                    subscription.unsubscribe();
                    resolve();
                } else if (status === 'error') {
                    clearTimeout(timeout);
                    subscription.unsubscribe();
                    reject(new Error('Connection failed'));
                }
            });
        });
    }

    // Public method to clear all listeners (useful before navigation or component destruction)
    clearAllListeners(): void {
        this.cleanupAllListeners();
    }

    // Method to check if Firestore is ready
    isReady(): boolean {
        return this.isInitialized && this.connectionStatus.value === 'connected';
    }

    private async initializeFirestore() {
        try {
            // Enable network to ensure connection
            await enableNetwork(this.firestore);
            this.isInitialized = true;
            this.connectionStatus.next('connected');
            console.log('Firestore initialized successfully');
        } catch (error: any) {
            console.error('Failed to initialize Firestore:', error);
            this.connectionStatus.next('error');
            
            // Attempt to recover from initialization failure
            if (error.message?.includes('INTERNAL ASSERTION FAILED')) {
                console.log('Attempting to recover from internal assertion failure...');
                setTimeout(() => this.handleConnectionError(error), 2000);
            }
        }
    }

    doc<T>(path: string): Observable<T | undefined> {
        const docRef = doc(this.firestore, path);
        return docData(docRef, { idField: 'id' }) as Observable<T | undefined>;
    }

    collection<T>(path: string, queryFn?: (ref: CollectionReference) => Query): Observable<T[]> {
        try {
            if (!this.isInitialized) {
                console.warn('Firestore not initialized, waiting for connection...');
                return from(this.waitForConnection()).pipe(
                    switchMap(() => this.collection<T>(path, queryFn)),
                    catchError(error => {
                        console.error('Error waiting for connection:', error);
                        return throwError(() => this.handleFirestoreError(error));
                    })
                );
            }

            const colRef = collection(this.firestore, path);
            const queryRef = queryFn ? queryFn(colRef) : colRef;
            
            return collectionData(queryRef, { idField: 'id' }).pipe(
                map(data => data as T[]),
                catchError(error => {
                    console.error('Collection data error:', error);
                    
                    // Handle specific Firebase errors
                    if (error.message?.includes('INTERNAL ASSERTION FAILED') || 
                        error.message?.includes('Target ID already exists')) {
                        console.log('Firestore listener conflict detected, triggering reconnection...');
                        this.handleConnectionError(error);
                    }
                    
                    return throwError(() => this.handleFirestoreError(error));
                }),
                takeUntil(this.destroy$)
            ) as Observable<T[]>;
        } catch (error) {
            console.error('Error in collection query:', error);
            return throwError(() => this.handleFirestoreError(error));
        }
    }

    async create<T>(path: string, data: any): Promise<string> {
        try {
            console.log('Creating document in path:', path, 'with data:', data);
            
            // Wait for initialization if not ready
            if (!this.isInitialized) {
                await this.initializeFirestore();
            }

            const colRef = collection(this.firestore, path);

            // Clean data and ensure proper structure
            const documentData = this.sanitizeData({
                ...data,
                createdAt: data.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            console.log('Final document data to save:', documentData);

            // Use timeout and retry for better reliability
            const docRef = await this.withRetry(async () => {
                return await addDoc(colRef, documentData);
            });
            
            console.log('Document created with ID:', docRef.id);
            return docRef.id;
        } catch (error: any) {
            console.error('Firestore create error details:', {
                code: error?.code,
                message: error?.message,
                details: error
            });
            throw this.handleFirestoreError(error);
        }
    }

    async update(path: string, data: any): Promise<void> {
        try {
            console.log('Updating document at path:', path, 'with data:', data);
            
            if (!this.isInitialized) {
                await this.initializeFirestore();
            }

            const docRef = doc(this.firestore, path);
            const updateData = this.sanitizeData({
                ...data,
                updatedAt: serverTimestamp()
            });
            
            await this.withRetry(async () => {
                await updateDoc(docRef, updateData);
            });
            
            console.log('Document updated successfully');
        } catch (error) {
            console.error('Error updating document:', error);
            throw this.handleFirestoreError(error);
        }
    }

    async delete(path: string): Promise<void> {
        try {
            if (!this.isInitialized) {
                await this.initializeFirestore();
            }

            const docRef = doc(this.firestore, path);
            await this.withRetry(async () => {
                await deleteDoc(docRef);
            });
            
            console.log('Document deleted successfully');
        } catch (error) {
            console.error('Error deleting document:', error);
            throw this.handleFirestoreError(error);
        }
    }

    // Helper method to sanitize data before saving to Firestore
    private sanitizeData(data: any): any {
        if (data === null || data === undefined) {
            return null;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item));
        }

        if (typeof data === 'object' && data.constructor === Object) {
            const sanitized: any = {};
            for (const key in data) {
                if (data.hasOwnProperty(key) && data[key] !== undefined) {
                    sanitized[key] = this.sanitizeData(data[key]);
                }
            }
            return sanitized;
        }

        return data;
    }

    // Helper method for retry logic
    private async withRetry<T>(operation: () => Promise<T>, maxRetries: number = 5): Promise<T> {
        let lastError: any;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Check connection status before attempting operation
                if (this.connectionStatus.value === 'error' && !this.isReconnecting) {
                    await this.reconnectFirestore();
                }
                
                return await operation();
            } catch (error: any) {
                lastError = error;
                console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
                
                // Handle internal assertion failures specifically
                if (error.message?.includes('INTERNAL ASSERTION FAILED')) {
                    console.log('Internal assertion failure detected, triggering reconnection...');
                    try {
                        await this.handleConnectionError(error);
                        // If reconnection succeeded, retry immediately
                        if (this.connectionStatus.value === 'connected') {
                            continue;
                        }
                    } catch (reconnectError) {
                        console.error('Reconnection failed during retry:', reconnectError);
                    }
                }
                
                if (attempt < maxRetries) {
                    // Wait before retry with exponential backoff
                    const delay = Math.min(Math.pow(2, attempt) * 1000, 10000); // Cap at 10 seconds
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    break;
                }
            }
        }
        
        throw lastError;
    }

    // Enhanced error handling
    private handleFirestoreError(error: any): Error {
        let message = 'An error occurred while accessing the database';
        
        // Handle specific error patterns first
        if (error.message?.includes('INTERNAL ASSERTION FAILED')) {
            message = 'Database connection error. Reconnecting...';
            return new Error(message);
        }
        
        if (error.message?.includes('Target ID already exists')) {
            message = 'Database listener conflict. Reconnecting...';
            return new Error(message);
        }
        
        if (error.code) {
            switch (error.code) {
                case 'unavailable':
                    message = 'Database is temporarily unavailable. Please try again.';
                    break;
                case 'permission-denied':
                    message = 'Permission denied. Please check your access rights.';
                    break;
                case 'not-found':
                    message = 'The requested document was not found.';
                    break;
                case 'resource-exhausted':
                    message = 'Too many requests. Please wait and try again.';
                    break;
                case 'failed-precondition':
                    message = 'The operation failed due to a precondition.';
                    break;
                case 'aborted':
                    message = 'The operation was aborted due to a conflict.';
                    break;
                case 'unauthenticated':
                    message = 'Authentication required.';
                    break;
                case 'internal':
                    message = 'Internal server error. Please try again later.';
                    break;
                default:
                    message = error.message || message;
            }
        } else {
            message = error.message || message;
        }
        
        return new Error(message);
    }
}