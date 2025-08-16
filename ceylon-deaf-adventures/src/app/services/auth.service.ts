// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, map, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    constructor(private auth: Auth, private firestore: Firestore) {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUserSubject.next({
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || '',
                    role: 'guest' // Default role
                });
            } else {
                this.currentUserSubject.next(null);
            }
        });
    }

    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    get isAdmin$(): Observable<boolean> {
        return this.currentUser$.pipe(
            map(user => user?.role === 'admin')
        );
    }

    async signIn(email: string, password: string): Promise<void> {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        // Additional user data can be fetched from Firestore if needed
    }

    async signOut(): Promise<void> {
        await signOut(this.auth);
    }

    async signUp(email: string, password: string, displayName: string): Promise<void> {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

        // Create user document in Firestore
        await setDoc(doc(this.firestore, `users/${userCredential.user.uid}`), {
            uid: userCredential.user.uid,
            email,
            displayName,
            role: 'guest',
            createdAt: new Date()
        };
    }
}