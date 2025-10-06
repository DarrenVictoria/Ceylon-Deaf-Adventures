import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil, combineLatest } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header class="login-header">
          <mat-card-title class="login-title" style="margin-bottom: 10px;">
            
            Admin Login
          </mat-card-title>
          <mat-card-subtitle>
            Sign in to access the Ceylon Deaf Adventures admin dashboard
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="login-content">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                autocomplete="email"
                [disabled]="isLoading"
              >
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                autocomplete="current-password"
                [disabled]="isLoading"
              >
              <mat-icon matPrefix>lock</mat-icon>
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword = !hidePassword"
                [disabled]="isLoading"
              >
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="login-button"
              [disabled]="!loginForm.valid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading">Signing In...</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="login-actions">
          <button
            mat-button
            type="button"
            (click)="goToMainSite()"
            [disabled]="isLoading"
            class="back-button"
          >
            <mat-icon>arrow_back</mat-icon>
            Back to Main Site
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FFD580 0%, #ADD8E6 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
    }

    .login-header {
      text-align: center;
      padding: 24px 24px 0 24px;
    }

    .login-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .login-title mat-icon {
      color: #2dd4bf;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .login-content {
      padding: 24px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-field {
      width: 100%;
    }

    .form-field ::ng-deep .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 12px;
      font-size: 0.875rem;
    }

    .error-message mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .login-button {
      width: 100%;
      height: 48px;
      border-radius: 12px !important;
      font-size: 1rem;
      font-weight: 600;
      position: relative;
      margin-top: 8px;
    }

    .spinner {
      margin-right: 8px;
    }

    .login-actions {
      padding: 0 24px 24px 24px;
      justify-content: center;
    }

    .back-button {
      color: #6b7280 !important;
    }

    .back-button:hover {
      color: #2dd4bf !important;
    }

    /* Responsive design */
    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }

      .login-card {
        max-width: none;
      }

      .login-header {
        padding: 20px 20px 0 20px;
      }

      .login-content {
        padding: 20px;
      }

      .login-actions {
        padding: 0 20px 20px 20px;
      }
    }
  `]
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to auth service loading and error states
    combineLatest([
      this.authService.loading$,
      this.authService.error$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([loading, error]) => {
        this.isLoading = loading;
        this.errorMessage = error;
      });

    // Clear any existing errors when component loads
    this.authService.clearError();

    // Check if already authenticated and redirect
    this.authService.isAdmin$.pipe(takeUntil(this.destroy$))
      .subscribe(isAdmin => {
        if (isAdmin) {
          this.router.navigate(['/admin/tours']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid && !this.isLoading) {
      const { email, password } = this.loginForm.value;

      try {
        await this.authService.signIn(email, password);
        // Navigation will be handled by auth state change
        this.router.navigate(['/admin/tours']);
      } catch (error) {
        // Error is already handled by the auth service
        console.error('Login error:', error);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  goToMainSite(): void {
    this.router.navigate(['/']);
  }
}