import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    constructor(private afs: AngularFirestore) { }

    doc<T>(path: string): Observable<T | undefined> {
        return this.afs.doc<T>(path).valueChanges();
    }

    collection<T>(path: string, queryFn?: (ref: any) => any): Observable<T[]> {
        let colRef = this.afs.collection<T>(path);
        if (queryFn) {
            colRef = this.afs.collection<T>(path, queryFn);
        }
        return colRef.valueChanges({ idField: 'id' });
    }

    async create<T>(path: string, data: T): Promise<string> {
        const docRef = await this.afs.collection(path).add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    }

    async update(path: string, data: any): Promise<void> {
        await this.afs.doc(path).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async delete(path: string): Promise<void> {
        await this.afs.doc(path).delete();
    }
}