// firestore.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    constructor(private firestore: Firestore) { }

    doc<T>(path: string): Observable<T> {
        const docRef = doc(this.firestore, path);
        return docData(docRef) as Observable<T>;
    }

    collection<T>(path: string, queryFn?: any): Observable<T[]> {
        let collectionRef = collection(this.firestore, path);
        if (queryFn) {
            collectionRef = query(collectionRef, queryFn) as any;
        }
        return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>;
    }

    async create<T>(path: string, data: T): Promise<string> {
        const collectionRef = collection(this.firestore, path);
        const docRef = await addDoc(collectionRef, data as any);
        return docRef.id;
    }

    async update(path: string, data: any): Promise<void> {
        const docRef = doc(this.firestore, path);
        await updateDoc(docRef, data);
    }

    async delete(path: string): Promise<void> {
        const docRef = doc(this.firestore, path);
        await deleteDoc(docRef);
    }
}