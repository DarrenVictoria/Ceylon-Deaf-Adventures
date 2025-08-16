import { Injectable } from "@angular/core"
import {
  type Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
} from "@angular/fire/auth"
import { type Observable, map, switchMap, of } from "rxjs"
import type { User } from "../models/user.model"
import type { FirestoreService } from "./firestore.service"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser$: Observable<User | null>
  isAdmin$: Observable<boolean>

  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService,
  ) {
    this.currentUser$ = user(this.auth).pipe(
      switchMap((firebaseUser) => {
        if (firebaseUser) {
          return this.firestoreService.doc<User>(`users/${firebaseUser.uid}`)
        }
        return of(null)
      }),
    )

    this.isAdmin$ = this.currentUser$.pipe(map((user) => user?.role === "admin" || false))
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password)
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password)

    const userData: Omit<User, "uid"> = {
      displayName,
      email,
      role: "guest",
      createdAt: new Date() as any,
    }

    await this.firestoreService.create(`users/${credential.user.uid}`, userData)
  }

  async signOut(): Promise<void> {
    await signOut(this.auth)
  }
}
