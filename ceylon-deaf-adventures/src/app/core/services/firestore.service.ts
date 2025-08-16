import { Injectable } from "@angular/core"
import {
  type Firestore,
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  docData,
  collectionData,
  query,
  type QueryConstraint,
  type DocumentReference,
  runTransaction,
} from "@angular/fire/firestore"
import type { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  doc<T>(path: string): Observable<T> {
    const docRef = doc(this.firestore, path)
    return docData(docRef, { idField: "id" }) as Observable<T>
  }

  collection<T>(path: string, queryFn?: QueryConstraint[]): Observable<T[]> {
    const collectionRef = collection(this.firestore, path)
    const q = queryFn ? query(collectionRef, ...queryFn) : collectionRef
    return collectionData(q, { idField: "id" }) as Observable<T[]>
  }

  async create<T>(path: string, data: T): Promise<DocumentReference> {
    const collectionRef = collection(this.firestore, path)
    return await addDoc(collectionRef, data)
  }

  async update(path: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, path)
    await updateDoc(docRef, data)
  }

  async delete(path: string): Promise<void> {
    const docRef = doc(this.firestore, path)
    await deleteDoc(docRef)
  }

  async runTransaction(fn: (transaction: any) => Promise<void>): Promise<void> {
    await runTransaction(this.firestore, fn)
  }
}
