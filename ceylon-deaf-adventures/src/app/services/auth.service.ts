import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, of, switchMap, map } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth = inject(Auth);
    private firestore = inject(Firestore);

    currentUser$: Observable<User | null>;
    isAdmin$: Observable<boolean>;

    constructor(private fs: FirestoreService) {
        this.currentUser$ = authState(this.auth).pipe(
            switchMap(user => {
                if (user) {
                    return this.fs.doc<User>(`users/${user.uid}`).pipe(
                        map(doc => doc ? { ...doc, uid: user.uid } : null)
                    );
                }
                return of(null);
            })
        );

        this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'admin'));
    }

    async signIn(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(this.auth, email, password);
    }

    async signOut(): Promise<void> {
        await signOut(this.auth);
    }

    // Add method to set custom role (for admin onboarding)
    async setUserRole(uid: string, role: 'guest' | 'admin'): Promise<void> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        await updateDoc(userDocRef, { role });
    }
}