import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
    constructor(private storage: AngularFireStorage) { }

    upload(path: string, file: File): Observable<{ progress: number, url?: string }> {
        const ref = this.storage.ref(path);
        const task = ref.put(file);
        return new Observable(observer => {
            task.percentageChanges().subscribe(progress => observer.next({ progress: progress || 0 }));
            task.snapshotChanges().pipe(
                finalize(async () => {
                    const url = await ref.getDownloadURL().toPromise();
                    observer.next({ progress: 100, url });
                    observer.complete();
                })
            ).subscribe();
        });
    }

    getDownloadUrl(path: string): Promise<string> {
        return this.storage.ref(path).getDownloadURL().toPromise();
    }
}