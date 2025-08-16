// storage.service.ts
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private storage: Storage) { }

    upload(path: string, file: File): Observable<{ progress: number, url?: string }> {
        return new Observable(subscriber => {
            const storageRef = ref(this.storage, path);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    subscriber.next({ progress });
                },
                (error) => {
                    subscriber.error(error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    subscriber.next({ progress: 100, url });
                    subscriber.complete();
                }
            );
        });
    }

    async getDownloadUrl(path: string): Promise<string> {
        const storageRef = ref(this.storage, path);
        return await getDownloadURL(storageRef);
    }
}