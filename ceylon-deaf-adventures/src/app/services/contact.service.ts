import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, getDocs, doc, updateDoc, Timestamp, deleteDoc } from '@angular/fire/firestore';
import { ContactMessage } from '../models/contact-message.model';
import { Observable, from, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private firestore = inject(Firestore);
    private collectionName = 'contact_messages';

    constructor() { }

    sendMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read' | 'status'>): Promise<any> {
        const newMessage: any = {
            ...message,
            createdAt: Timestamp.now(),
            read: false,
            status: 'new'
        };
        const collectionRef = collection(this.firestore, this.collectionName);
        return addDoc(collectionRef, newMessage);
    }

    getMessages(): Observable<ContactMessage[]> {
        const collectionRef = collection(this.firestore, this.collectionName);
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        return from(getDocs(q)).pipe(
            map(snapshot => snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ContactMessage)))
        );
    }

    markAsRead(id: string): Promise<void> {
        const docRef = doc(this.firestore, this.collectionName, id);
        return updateDoc(docRef, { read: true });
    }

    updateStatus(id: string, status: 'new' | 'replied' | 'archived'): Promise<void> {
        const docRef = doc(this.firestore, this.collectionName, id);
        return updateDoc(docRef, { status });
    }

    deleteMessage(id: string): Promise<void> {
        const docRef = doc(this.firestore, this.collectionName, id);
        return deleteDoc(docRef);
    }
}
