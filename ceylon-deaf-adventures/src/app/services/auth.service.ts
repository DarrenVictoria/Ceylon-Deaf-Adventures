import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { User } from '../models/user';
import firebase from 'firebase/compat/app';

@Injectable({ providedIn: 'root' })
export class AuthService {
    currentUser$: Observable<User | null>;
    isAdmin$: Observable<boolean>;

    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
        this.currentUser$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges().pipe(
                        map(doc => doc ? { ...doc, uid: user.uid } : null)
                    );
                }
                return [null];
            })
        );

        this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'admin'));
    }

    async signIn(email: string, password: string): Promise<void> {
        await this.afAuth.signInWithEmailAndPassword(email, password);
    }

    async signOut(): Promise<void> {
        await this.afAuth.signOut();
    }

    // Add method to set custom role (for admin onboarding)
    async setUserRole(uid: string, role: 'guest' | 'admin'): Promise<void> {
        await this.afs.doc(`users/${uid}`).update({ role });
    }
}