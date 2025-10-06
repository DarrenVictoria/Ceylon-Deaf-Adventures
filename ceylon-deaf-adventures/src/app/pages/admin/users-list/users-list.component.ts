import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { UserManagementService } from '../../../services/user-management.service';
import { AuthService } from '../../../services/auth.service';
import { UserFormDialogComponent } from './user-form-dialog.component';
import {
  User,
  UserRole,
  PermissionKey,
  getRoleDisplayName,
  getUserDisplayName,
  canManageUsers
} from '../../../models/user';
import { MatDivider, MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    AdminNavigationComponent,
    MatDivider,
    MatDividerModule
  ],
  template: `
    <app-admin-navigation></app-admin-navigation>
    
    <div class="users-container">
      <mat-card class="users-card">
        <mat-card-header class="users-header">
          <mat-card-title class="users-title">
            <mat-icon>people</mat-icon>
            User Management
          </mat-card-title>
          <div class="header-actions">
            <button
              mat-raised-button
              color="primary"
              (click)="createUser()"
              [disabled]="!canManage || isLoading"
            >
              <mat-icon>person_add</mat-icon>
              Add New Manager
            </button>
          </div>
        </mat-card-header>

        <mat-card-content class="users-content">
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading users...</p>
          </div>

          <div *ngIf="!isLoading && users.length === 0" class="empty-state">
            <mat-icon>people_outline</mat-icon>
            <h3>No Users Found</h3>
            <p>Create your first manager account to get started.</p>
            <button
              mat-raised-button
              color="primary"
              (click)="createUser()"
              [disabled]="!canManage"
            >
              <mat-icon>person_add</mat-icon>
              Add New Manager
            </button>
          </div>

          <div *ngIf="!isLoading && users.length > 0" class="users-table-container">
            <table mat-table [dataSource]="users" class="users-table">
              <!-- User Info Column -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let user" class="user-cell">
                  <div class="user-info">
                    <div class="user-avatar">
                      <mat-icon>account_circle</mat-icon>
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{ getUserDisplayName(user) }}</div>
                      <div class="user-email">{{ user.email }}</div>
                      <div class="user-department" *ngIf="user.department">
                        {{ user.department }}
                      </div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip 
                    [class]="'role-chip role-' + user.role"
                    [disabled]="!user.isActive"
                  >
                    {{ getRoleDisplayName(user.role) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Permissions Column -->
              <ng-container matColumnDef="permissions">
                <th mat-header-cell *matHeaderCellDef>Permissions</th>
                <td mat-cell *matCellDef="let user" class="permissions-cell">
                  <div class="permissions-chips">
                    <mat-chip
                      *ngFor="let permission of getActivePermissions(user)"
                      class="permission-chip"
                      [disabled]="!user.isActive"
                    >
                      {{ getPermissionDisplayName(permission) }}
                    </mat-chip>
                    <span *ngIf="getActivePermissions(user).length === 0" class="no-permissions">
                      No permissions
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip 
                    [class]="user.isActive ? 'status-active' : 'status-inactive'"
                  >
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Last Login Column -->
              <ng-container matColumnDef="lastLogin">
                <th mat-header-cell *matHeaderCellDef>Last Login</th>
                <td mat-cell *matCellDef="let user" class="last-login-cell">
                  <span *ngIf="user.lastLoginAt; else never">
                    {{ formatDate(user.lastLoginAt) }}
                  </span>
                  <ng-template #never>
                    <span class="never-logged-in">Never</span>
                  </ng-template>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user" class="actions-cell">
                  <button 
                    mat-icon-button 
                    [matMenuTriggerFor]="userMenu"
                    [disabled]="!canManage || isCurrentUser(user)"
                    matTooltip="User Actions"
                  >
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  
                  <mat-menu #userMenu="matMenu">
                    <button mat-menu-item (click)="editUser(user)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit User</span>
                    </button>
                    <button mat-menu-item (click)="editPermissions(user)">
                      <mat-icon>security</mat-icon>
                      <span>Edit Permissions</span>
                    </button>
                    <button mat-menu-item (click)="toggleUserStatus(user)">
                      <mat-icon>{{ user.isActive ? 'block' : 'check_circle' }}</mat-icon>
                      <span>{{ user.isActive ? 'Deactivate' : 'Activate' }}</span>
                    </button>
                    <mat-divider></mat-divider>
                    <button 
                      mat-menu-item 
                      (click)="deleteUser(user)"
                      class="delete-action"
                    >
                      <mat-icon>delete</mat-icon>
                      <span>Delete User</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr 
                mat-row 
                *matRowDef="let row; columns: displayedColumns;"
                [class.inactive-row]="!row.isActive"
              ></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .users-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
    }

    .users-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .users-title mat-icon {
      color: #2dd4bf;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .header-actions button {
      border-radius: 8px !important;
      font-weight: 600;
    }

    .users-content {
      padding: 24px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      gap: 16px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .users-table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
      background: white;
    }

    .user-cell {
      padding: 16px 8px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #6b7280;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-weight: 600;
      color: #1f2937;
    }

    .user-email {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .user-department {
      font-size: 0.75rem;
      color: #9ca3af;
      font-style: italic;
    }

    .role-chip {
      font-size: 0.75rem !important;
      font-weight: 600 !important;
    }

    .role-admin {
      background-color: #dc2626 !important;
      color: white !important;
    }

    .role-manager {
      background-color: #2563eb !important;
      color: white !important;
    }

    .permissions-cell {
      max-width: 200px;
    }

    .permissions-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .permission-chip {
      font-size: 0.75rem !important;
      background-color: #f3f4f6 !important;
      color: #374151 !important;
    }

    .no-permissions {
      font-size: 0.875rem;
      color: #9ca3af;
      font-style: italic;
    }

    .status-active {
      background-color: #16a34a !important;
      color: white !important;
    }

    .status-inactive {
      background-color: #dc2626 !important;
      color: white !important;
    }

    .last-login-cell {
      font-size: 0.875rem;
    }

    .never-logged-in {
      color: #9ca3af;
      font-style: italic;
    }

    .actions-cell {
      text-align: right;
    }

    .delete-action {
      color: #dc2626 !important;
    }

    .inactive-row {
      opacity: 0.6;
      background-color: #f9fafb;
    }

    @media (max-width: 768px) {
      .users-container {
        padding: 16px;
      }

      .users-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-actions {
        width: 100%;
      }

      .header-actions button {
        width: 100%;
      }

      .user-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .permissions-chips {
        flex-direction: column;
      }
    }
  `]
})
export class UsersListComponent implements OnInit, OnDestroy {
  private userManagementService = inject(UserManagementService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  users: User[] = [];
  isLoading = false;
  canManage = false;
  currentUser: User | null = null;

  displayedColumns: string[] = [
    'user',
    'role',
    'permissions',
    'status',
    'lastLogin',
    'actions'
  ];

  ngOnInit(): void {
    // Check if user can manage users
    this.canManage = this.userManagementService.canManageUsers();
    if (!this.canManage) {
      this.snackBar.open('Access denied. Admin privileges required.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    // Get current user
    this.currentUser = this.authService.getCurrentUser();

    // Load users and loading state
    combineLatest([
      this.userManagementService.getAllUsers(),
      this.userManagementService.isLoading()
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([users, loading]) => {
        this.users = users;
        this.isLoading = loading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createUser(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSuccess('User created successfully');
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', user: { ...user } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSuccess('User updated successfully');
      }
    });
  }

  editPermissions(user: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'permissions', user: { ...user } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSuccess('Permissions updated successfully');
      }
    });
  }

  async toggleUserStatus(user: User): Promise<void> {
    if (!user.id) return;

    try {
      await this.userManagementService.toggleUserStatus(user.id);
      this.showSuccess(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error: any) {
      this.showError(error.message || 'Failed to update user status');
    }
  }

  async deleteUser(user: User): Promise<void> {
    if (!user.id) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${getUserDisplayName(user)}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await this.userManagementService.deleteUser(user.id);
        this.showSuccess('User deleted successfully');
      } catch (error: any) {
        this.showError(error.message || 'Failed to delete user');
      }
    }
  }

  isCurrentUser(user: User): boolean {
    return user.uid === this.currentUser?.uid;
  }

  getUserDisplayName(user: User): string {
    return getUserDisplayName(user);
  }

  getRoleDisplayName(role: UserRole): string {
    return getRoleDisplayName(role);
  }

  getActivePermissions(user: User): PermissionKey[] {
    const permissions: PermissionKey[] = [];
    if (user.permissions.tours) permissions.push('tours');
    if (user.permissions.blogs) permissions.push('blogs');
    if (user.permissions.bookings) permissions.push('bookings');
    if (user.permissions.users) permissions.push('users');
    return permissions;
  }

  getPermissionDisplayName(permission: PermissionKey): string {
    return this.userManagementService.getPermissionDisplayName(permission);
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'Never';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Invalid date';
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'success-snackbar'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }
}