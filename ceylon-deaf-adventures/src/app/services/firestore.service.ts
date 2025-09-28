import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, docData, addDoc, updateDoc, deleteDoc, query, Query, CollectionReference, QueryConstraint, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    private firestore = inject(Firestore);

    doc<T>(path: string): Observable<T | undefined> {
        const docRef = doc(this.firestore, path);
        return docData(docRef) as Observable<T | undefined>;
    }

    collection<T>(path: string, queryFn?: (ref: CollectionReference) => Query): Observable<T[]> {
        const colRef = collection(this.firestore, path);
        let queryRef = queryFn ? queryFn(colRef) : colRef;
        return collectionData(queryRef, { idField: 'id' }) as Observable<T[]>;
    }

    async create<T>(path: string, data: T): Promise<string> {
        const colRef = collection(this.firestore, path);
        const docRef = await addDoc(colRef, {
            ...data,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }

    async update(path: string, data: any): Promise<void> {
        const docRef = doc(this.firestore, path);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    }

    async delete(path: string): Promise<void> {
        const docRef = doc(this.firestore, path);
        await deleteDoc(docRef);
    }
}