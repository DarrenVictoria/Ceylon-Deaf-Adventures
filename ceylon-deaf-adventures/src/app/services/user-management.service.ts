import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updatePassword, User as FirebaseUser } from '@angular/fire/auth';
import { Observable, from, throwError, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError, tap, first } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { 
  User, 
  UserRole, 
  UserPermissions, 
  PermissionKey,
  createDefaultPermissions,
  isAdmin,
  canManageUsers
} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private auth = inject(Auth);
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);

  // State management for users list
  private usersSubject$ = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject$.asObservable();
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Load users on service initialization
    this.loadUsers();
  }

  /**
   * Load all users from Firestore
   */
  private loadUsers(): void {
    this.firestoreService.collection<User>('users')
      .pipe(
        tap(users => this.usersSubject$.next(users)),
        catchError(error => {
          console.error('Error loading users:', error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    return this.users$;
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User | undefined> {
    return this.users$.pipe(
      map(users => users.find(user => user.id === id))
    );
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: UserRole): Observable<User[]> {
    return this.users$.pipe(
      map(users => users.filter(user => user.role === role))
    );
  }

  /**
   * Create a new user account (Firebase Auth + Firestore)
   */
  async createUser(userData: {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
    permissions: UserPermissions;
    department?: string;
    phone?: string;
    notes?: string;
  }): Promise<string> {
    // Check if current user can manage users
    const currentUser = this.authService.getCurrentUser();
    if (!canManageUsers(currentUser)) {
      throw new Error('Insufficient permissions to create users');
    }

    this.loading$.next(true);

    try {
      // Create Firebase Authentication account
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const userDoc: Omit<User, 'id'> = {
        uid: firebaseUser.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        isActive: true,
        permissions: userData.permissions,
        createdBy: currentUser?.uid,
        department: userData.department,
        phone: userData.phone,
        notes: userData.notes
      };

      const docId = await this.firestoreService.create('users', userDoc);

      // Reload users list
      this.loadUsers();

      return docId;
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Handle specific Firebase Auth errors
      let errorMessage = 'Failed to create user account';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    } finally {
      this.loading$.next(false);
    }
  }

  /**
   * Update user information (Firestore only)
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!canManageUsers(currentUser)) {
      throw new Error('Insufficient permissions to update users');
    }

    this.loading$.next(true);

    try {
      // Remove fields that shouldn't be updated
      const { id, uid, createdAt, createdBy, ...updateData } = updates;

      await this.firestoreService.update(`users/${userId}`, updateData);

      // Reload users list
      this.loadUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.message || 'Failed to update user');
    } finally {
      this.loading$.next(false);
    }
  }

  /**
   * Update user permissions
   */
  async updateUserPermissions(userId: string, permissions: UserPermissions): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!canManageUsers(currentUser)) {
      throw new Error('Insufficient permissions to update user permissions');
    }

    // Don't allow removing user management permission from admins
    const user = await this.getUserById(userId).pipe(first()).toPromise();
    if (user?.role === 'admin' && !permissions.users) {
      permissions.users = true;
    }

    return this.updateUser(userId, { permissions });
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!canManageUsers(currentUser)) {
      throw new Error('Insufficient permissions to change user status');
    }

    const user = await this.getUserById(userId).pipe(first()).toPromise();
    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow deactivating self
    if (user.uid === currentUser?.uid) {
      throw new Error('Cannot deactivate your own account');
    }

    return this.updateUser(userId, { isActive: !user.isActive });
  }

  /**
   * Delete user (soft delete - deactivate)
   */
  async deleteUser(userId: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!canManageUsers(currentUser)) {
      throw new Error('Insufficient permissions to delete users');
    }

    const user = await this.getUserById(userId).pipe(first()).toPromise();
    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow deleting self
    if (user.uid === currentUser?.uid) {
      throw new Error('Cannot delete your own account');
    }

    // For now, we'll just deactivate the user instead of hard delete
    return this.updateUser(userId, { isActive: false });
  }

  /**
   * Check if current user can perform user management actions
   */
  canManageUsers(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return canManageUsers(currentUser);
  }

  /**
   * Get permission display name
   */
  getPermissionDisplayName(permission: PermissionKey): string {
    switch (permission) {
      case 'tours':
        return 'Tours Management';
      case 'blogs':
        return 'Blogs Management';
      case 'bookings':
        return 'Bookings Management';
      case 'users':
        return 'User Management';
      default:
        return permission;
    }
  }

  /**
   * Get all available permissions
   */
  getAllPermissions(): PermissionKey[] {
    return ['tours', 'blogs', 'bookings', 'users'];
  }

  /**
   * Validate user data before creation/update
   */
  validateUserData(userData: Partial<User>): string[] {
    const errors: string[] = [];

    if (userData.email && !this.isValidEmail(userData.email)) {
      errors.push('Invalid email address');
    }

    if (userData.displayName && userData.displayName.trim().length < 2) {
      errors.push('Display name must be at least 2 characters');
    }

    if (userData.role === 'manager' && userData.permissions) {
      // Manager cannot have user management permissions
      if (userData.permissions.users) {
        errors.push('Managers cannot have user management permissions');
      }
    }

    return errors;
  }

  /**
   * Email validation helper
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get loading state
   */
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}