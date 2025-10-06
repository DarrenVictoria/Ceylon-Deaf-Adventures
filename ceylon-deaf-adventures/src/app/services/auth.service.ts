import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, of, combineLatest } from 'rxjs';
import { map, switchMap, tap, catchError, first } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';
import { User, isAuthorizedUser, canManageUsers, hasPermission, PermissionKey } from '../models/user';
import { serverTimestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestoreService = inject(FirestoreService);

  // State management
  private currentUserSubject$ = new BehaviorSubject<User | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(true);
  private authError$ = new BehaviorSubject<string | null>(null);

  // Public observables
  public currentUser$ = this.currentUserSubject$.asObservable();
  public isAdmin$ = this.currentUserSubject$.pipe(map(user => !!user && isAuthorizedUser(user)));
  public loading$ = this.isLoading$.asObservable();
  public error$ = this.authError$.asObservable();

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialize Firebase auth state listener
   */
  private initializeAuthState(): void {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, check if they're an admin
        this.loadUserProfile(firebaseUser.uid)
          .subscribe({
            next: (user) => {
              if (user && isAuthorizedUser(user)) {
                this.currentUserSubject$.next(user);
                this.updateLastLogin(user.uid);
              } else {
                console.warn('User not authorized for admin access:', firebaseUser.email);
                this.signOut(); // Sign out non-admin users
              }
              this.isLoading$.next(false);
            },
            error: (error) => {
              console.error('Error loading user profile:', error);
              this.authError$.next('Failed to load user profile');
              this.currentUserSubject$.next(null);
              this.isLoading$.next(false);
            }
          });
      } else {
        // User is signed out
        this.currentUserSubject$.next(null);
        this.isLoading$.next(false);
      }
    });
  }

  /**
   * Load user profile from Firestore
   */
  private loadUserProfile(uid: string): Observable<User | null> {
    return this.firestoreService.collection<User>('users').pipe(
      map(users => users.find(user => user.uid === uid) || null),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of(null);
      })
    );
  }

  /**
   * Update user's last login timestamp
   */
  private updateLastLogin(uid: string): void {
    // Find the document ID for this user
    this.firestoreService.collection<User>('users').pipe(
      map(users => users.find(user => user.uid === uid)),
      first()
    ).subscribe(user => {
      if (user?.id) {
        this.firestoreService.update(`users/${user.id}`, {
          lastLoginAt: serverTimestamp()
        }).catch(error => {
          console.error('Error updating last login:', error);
        });
      }
    });
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<void> {
    try {
      this.isLoading$.next(true);
      this.authError$.next(null);

      console.log('🔐 Attempting sign in for:', email);
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('🔐 Firebase auth successful for:', userCredential.user.email);

      // Load user profile to check admin status
      const userProfile = await this.loadUserProfile(userCredential.user.uid).pipe(first()).toPromise();
      
      if (!userProfile) {
        throw new Error('User profile not found in admin database');
      }

      if (!isAuthorizedUser(userProfile)) {
        await this.signOut();
        throw new Error('Access denied. Admin or manager privileges required.');
      }

      console.log('✅ Admin access granted for:', userProfile.email);
      
      // Navigation will be handled by auth state change
    } catch (error: any) {
      console.error('❌ Sign in failed:', error);
      let errorMessage = 'Sign in failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Sign in failed';
      }
      
      this.authError$.next(errorMessage);
      this.isLoading$.next(false);
      throw new Error(errorMessage);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      console.log('🔓 Signing out user');
      await signOut(this.auth);
      this.currentUserSubject$.next(null);
      this.authError$.next(null);
      this.router.navigate(['/admin/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject$.value;
  }

  /**
   * Check if current user has specific permission
   */
  hasPermission(permission: PermissionKey): boolean {
    const user = this.getCurrentUser();
    return hasPermission(user, permission);
  }

  /**
   * Check if current user is authenticated and authorized
   */
  isAuthorized(): boolean {
    const user = this.getCurrentUser();
    return !!user && isAuthorizedUser(user);
  }

  /**
   * Check if current user can manage other users
   */
  canManageUsers(): boolean {
    const user = this.getCurrentUser();
    return canManageUsers(user);
  }

  /**
   * Clear authentication error
   */
  clearError(): void {
    this.authError$.next(null);
  }

  // Legacy methods for compatibility
  async setUserRole(uid: string, role: 'guest' | 'admin'): Promise<void> {
    console.warn('setUserRole is deprecated. Manage user roles through Firestore directly.');
  }
}
