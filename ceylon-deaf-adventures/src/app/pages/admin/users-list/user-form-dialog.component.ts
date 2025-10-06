import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { UserManagementService } from '../../../services/user-management.service';
import { 
  User, 
  UserRole, 
  UserPermissions,
  PermissionKey,
  createDefaultPermissions
} from '../../../models/user';

export interface UserFormDialogData {
  mode: 'create' | 'edit' | 'permissions';
  user?: User;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>{{ getDialogIcon() }}</mat-icon>
        {{ getDialogTitle() }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="userForm" class="user-form">
          <!-- Basic User Information (Create/Edit modes) -->
          <div *ngIf="data.mode !== 'permissions'" class="form-section">
            <h3 class="section-title">Basic Information</h3>
            
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email Address</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="user@ceylondeafadventures.com"
                [readonly]="data.mode === 'edit'"
              >
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
                <span *ngIf="userForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="userForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field" *ngIf="data.mode === 'create'">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                placeholder="Minimum 6 characters"
              >
              <mat-icon matPrefix>lock</mat-icon>
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword = !hidePassword"
              >
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
                <span *ngIf="userForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="userForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Display Name</mat-label>
              <input
                matInput
                formControlName="displayName"
                placeholder="John Doe"
              >
              <mat-icon matPrefix>person</mat-icon>
              <mat-error *ngIf="userForm.get('displayName')?.invalid && userForm.get('displayName')?.touched">
                <span *ngIf="userForm.get('displayName')?.errors?.['required']">Display name is required</span>
                <span *ngIf="userForm.get('displayName')?.errors?.['minlength']">Display name must be at least 2 characters</span>
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" (selectionChange)="onRoleChange()">
                <mat-option value="manager">Manager</mat-option>
                <!-- Admin role creation would be handled separately or through database -->
              </mat-select>
              <mat-icon matPrefix>badge</mat-icon>
            </mat-form-field>
          </div>

          <!-- Optional Information (Create/Edit modes) -->
          <div *ngIf="data.mode !== 'permissions'" class="form-section">
            <h3 class="section-title">Additional Information (Optional)</h3>
            
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Department</mat-label>
              <input
                matInput
                formControlName="department"
                placeholder="Operations, Marketing, etc."
              >
              <mat-icon matPrefix>business</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Phone Number</mat-label>
              <input
                matInput
                formControlName="phone"
                placeholder="+94 XX XXX XXXX"
              >
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Notes</mat-label>
              <textarea
                matInput
                formControlName="notes"
                rows="3"
                placeholder="Additional notes about this user..."
              ></textarea>
              <mat-icon matPrefix>note</mat-icon>
            </mat-form-field>
          </div>

          <!-- Permissions Section -->
          <div class="form-section">
            <h3 class="section-title">
              {{ data.mode === 'permissions' ? 'User Permissions' : 'Permissions' }}
            </h3>
            <p class="section-description">
              Select which areas this manager can access and manage.
            </p>

            <div class="permissions-grid">
              <mat-checkbox 
                formControlName="toursPermission"
                class="permission-checkbox"
              >
                <div class="permission-info">
                  <div class="permission-label">
                    <mat-icon>tour</mat-icon>
                    Tours Management
                  </div>
                  <div class="permission-description">
                    Create, edit, and manage tour packages
                  </div>
                </div>
              </mat-checkbox>

              <mat-checkbox 
                formControlName="blogsPermission"
                class="permission-checkbox"
              >
                <div class="permission-info">
                  <div class="permission-label">
                    <mat-icon>article</mat-icon>
                    Blogs Management
                  </div>
                  <div class="permission-description">
                    Create, edit, and publish blog posts
                  </div>
                </div>
              </mat-checkbox>

              <mat-checkbox 
                formControlName="bookingsPermission"
                class="permission-checkbox"
              >
                <div class="permission-info">
                  <div class="permission-label">
                    <mat-icon>book_online</mat-icon>
                    Bookings Management
                  </div>
                  <div class="permission-description">
                    View and manage customer bookings
                  </div>
                </div>
              </mat-checkbox>

              <!-- Users permission is not available for managers -->
              <div class="permission-info disabled-permission">
                <div class="permission-label">
                  <mat-icon>people</mat-icon>
                  User Management
                </div>
                <div class="permission-description">
                  Only available to administrators
                </div>
              </div>
            </div>
          </div>

          <!-- Validation Errors -->
          <div *ngIf="validationErrors.length > 0" class="validation-errors">
            <mat-icon>error_outline</mat-icon>
            <div>
              <p><strong>Please fix the following errors:</strong></p>
              <ul>
                <li *ngFor="let error of validationErrors">{{ error }}</li>
              </ul>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button
          mat-button
          type="button"
          (click)="onCancel()"
          [disabled]="isSubmitting"
        >
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="onSubmit()"
          [disabled]="!userForm.valid || isSubmitting"
        >
          <mat-spinner *ngIf="isSubmitting" diameter="20" class="button-spinner"></mat-spinner>
          <span *ngIf="!isSubmitting">{{ getSubmitButtonText() }}</span>
          <span *ngIf="isSubmitting">{{ getSubmittingText() }}</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .dialog-title mat-icon {
      color: #2dd4bf;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .dialog-content {
      padding: 0 24px;
    }

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .section-description {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .form-field {
      width: 100%;
    }

    .permissions-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .permission-checkbox {
      width: 100%;
    }

    .permission-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-left: 8px;
    }

    .permission-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #374151;
    }

    .permission-label mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #6b7280;
    }

    .permission-description {
      font-size: 0.875rem;
      color: #6b7280;
      margin-left: 32px;
    }

    .disabled-permission {
      opacity: 0.5;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background-color: #f9fafb;
    }

    .disabled-permission .permission-label {
      color: #9ca3af;
    }

    .validation-errors {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
    }

    .validation-errors mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 2px;
    }

    .validation-errors ul {
      margin: 8px 0 0 0;
      padding-left: 16px;
    }

    .dialog-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .button-spinner {
      margin-right: 8px;
    }

    @media (max-width: 600px) {
      .dialog-container {
        max-width: 100vw;
        width: 100vw;
        margin: 0;
      }

      .dialog-actions {
        flex-direction: column;
      }

      .dialog-actions button {
        width: 100%;
      }
    }
  `]
})
export class UserFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userManagementService = inject(UserManagementService);
  private dialogRef = inject(MatDialogRef<UserFormDialogComponent>);

  userForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;
  validationErrors: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' || this.data.mode === 'permissions') {
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    const formConfig: any = {};

    // Basic fields for create/edit modes
    if (this.data.mode !== 'permissions') {
      formConfig.email = ['', [Validators.required, Validators.email]];
      formConfig.displayName = ['', [Validators.required, Validators.minLength(2)]];
      formConfig.role = ['manager', [Validators.required]];
      formConfig.department = [''];
      formConfig.phone = [''];
      formConfig.notes = [''];

      // Password only required for create mode
      if (this.data.mode === 'create') {
        formConfig.password = ['', [Validators.required, Validators.minLength(6)]];
      }
    }

    // Permission fields
    formConfig.toursPermission = [false];
    formConfig.blogsPermission = [false];
    formConfig.bookingsPermission = [false];

    return this.fb.group(formConfig);
  }

  private populateForm(): void {
    if (!this.data.user) return;

    const user = this.data.user;
    
    // Populate basic information
    if (this.data.mode === 'edit') {
      this.userForm.patchValue({
        email: user.email,
        displayName: user.displayName || '',
        role: user.role,
        department: user.department || '',
        phone: user.phone || '',
        notes: user.notes || ''
      });
    }

    // Populate permissions
    this.userForm.patchValue({
      toursPermission: user.permissions.tours,
      blogsPermission: user.permissions.blogs,
      bookingsPermission: user.permissions.bookings
    });
  }

  onRoleChange(): void {
    // Reset permissions when role changes
    if (this.userForm.get('role')?.value === 'manager') {
      this.userForm.patchValue({
        toursPermission: false,
        blogsPermission: false,
        bookingsPermission: false
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.userForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.validationErrors = [];

    try {
      const formValue = this.userForm.value;

      if (this.data.mode === 'create') {
        await this.createUser(formValue);
      } else if (this.data.mode === 'edit') {
        await this.updateUser(formValue);
      } else if (this.data.mode === 'permissions') {
        await this.updatePermissions(formValue);
      }

      this.dialogRef.close(true);
    } catch (error: any) {
      console.error('Form submission error:', error);
      this.validationErrors = [error.message || 'An error occurred'];
    } finally {
      this.isSubmitting = false;
    }
  }

  private async createUser(formValue: any): Promise<void> {
    const permissions: UserPermissions = {
      tours: formValue.toursPermission,
      blogs: formValue.blogsPermission,
      bookings: formValue.bookingsPermission,
      users: false // Managers cannot have user management permissions
    };

    const userData = {
      email: formValue.email,
      password: formValue.password,
      displayName: formValue.displayName,
      role: formValue.role as UserRole,
      permissions,
      department: formValue.department,
      phone: formValue.phone,
      notes: formValue.notes
    };

    // Validate data
    const errors = this.userManagementService.validateUserData(userData);
    if (errors.length > 0) {
      this.validationErrors = errors;
      throw new Error('Validation failed');
    }

    await this.userManagementService.createUser(userData);
  }

  private async updateUser(formValue: any): Promise<void> {
    if (!this.data.user?.id) throw new Error('User ID is required for update');

    const permissions: UserPermissions = {
      tours: formValue.toursPermission,
      blogs: formValue.blogsPermission,
      bookings: formValue.bookingsPermission,
      users: this.data.user.permissions.users // Keep existing user permission
    };

    const updateData: Partial<User> = {
      displayName: formValue.displayName,
      role: formValue.role,
      permissions,
      department: formValue.department,
      phone: formValue.phone,
      notes: formValue.notes
    };

    await this.userManagementService.updateUser(this.data.user.id, updateData);
  }

  private async updatePermissions(formValue: any): Promise<void> {
    if (!this.data.user?.id) throw new Error('User ID is required for update');

    const permissions: UserPermissions = {
      tours: formValue.toursPermission,
      blogs: formValue.blogsPermission,
      bookings: formValue.bookingsPermission,
      users: this.data.user.permissions.users // Keep existing user permission
    };

    await this.userManagementService.updateUserPermissions(this.data.user.id, permissions);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  getDialogIcon(): string {
    switch (this.data.mode) {
      case 'create':
        return 'person_add';
      case 'edit':
        return 'edit';
      case 'permissions':
        return 'security';
      default:
        return 'person';
    }
  }

  getDialogTitle(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Add New Manager';
      case 'edit':
        return 'Edit User';
      case 'permissions':
        return 'Edit Permissions';
      default:
        return 'User Form';
    }
  }

  getSubmitButtonText(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Create Manager';
      case 'edit':
        return 'Update User';
      case 'permissions':
        return 'Save Permissions';
      default:
        return 'Save';
    }
  }

  getSubmittingText(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Creating...';
      case 'edit':
        return 'Updating...';
      case 'permissions':
        return 'Saving...';
      default:
        return 'Saving...';
    }
  }
}