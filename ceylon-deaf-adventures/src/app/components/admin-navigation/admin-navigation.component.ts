import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { canManageUsers } from '../../models/user';
import { ConnectionStatusComponent } from '../connection-status/connection-status.component';

@Component({
  selector: 'app-admin-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    ConnectionStatusComponent
  ],
  template: `
    <div class="admin-nav-container">
      <mat-card class="admin-nav-card">
        <mat-card-content>
          <div class="admin-nav-header">
            <h2 class="admin-nav-title">
              <mat-icon>admin_panel_settings</mat-icon>
              Admin Dashboard
            </h2>
            <div class="header-actions">
              <app-connection-status></app-connection-status>
              
              <!-- User Menu -->
              <div class="user-menu" *ngIf="authService.currentUser$ | async as user">
                <button 
                  mat-button 
                  [matMenuTriggerFor]="userMenu" 
                  class="user-menu-button"
                >
                  <mat-icon>account_circle</mat-icon>
                  <span class="user-info">
                    {{ user.displayName || user.email }}
                    <small class="user-role">({{ user.role | titlecase }})</small>
                  </span>
                  <mat-icon>arrow_drop_down</mat-icon>
                </button>
                
                <mat-menu #userMenu="matMenu">
                  <button mat-menu-item (click)="goToMainSite()">
                    <mat-icon>home</mat-icon>
                    <span>Back to Site</span>
                  </button>
                  <button mat-menu-item (click)="logout()">
                    <mat-icon>logout</mat-icon>
                    <span>Logout</span>
                  </button>
                </mat-menu>
              </div>
              
              <!-- Fallback if not authenticated -->
              <a 
                [routerLink]="['/']" 
                mat-button 
                class="back-to-site-btn"
                *ngIf="!(authService.currentUser$ | async)"
              >
                <mat-icon>arrow_back</mat-icon>
                Back to Site
              </a>
            </div>
          </div>
          
          <nav class="admin-nav">
            <a 
              [routerLink]="['/admin/tours']" 
              routerLinkActive="active"
              mat-stroked-button
              class="nav-btn"
            >
              <mat-icon>tour</mat-icon>
              <span>Manage Tours</span>
            </a>
            
            <a 
              [routerLink]="['/admin/blogs']" 
              routerLinkActive="active"
              mat-stroked-button
              class="nav-btn"
            >
              <mat-icon>article</mat-icon>
              <span>Manage Blogs</span>
            </a>
            
            <a 
              [routerLink]="['/admin/bookings']" 
              routerLinkActive="active"
              mat-stroked-button
              class="nav-btn"
            >
              <mat-icon>book_online</mat-icon>
              <span>Manage Bookings</span>
            </a>
            
            <!-- User Management - Only visible to admins -->
            <a 
              [routerLink]="['/admin/users']" 
              routerLinkActive="active"
              mat-stroked-button
              class="nav-btn"
              *ngIf="canShowUserManagement()"
            >
              <mat-icon>people</mat-icon>
              <span>Manage Users</span>
            </a>
          </nav>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-nav-container {
      margin-bottom: 32px;
    }

    .admin-nav-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .admin-nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .admin-nav-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .admin-nav-title mat-icon {
      color: #2dd4bf;
      font-size: 1.75rem !important;
      width: 1.75rem;
      height: 1.75rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-to-site-btn {
      color: #6b7280 !important;
      border: 1px solid #d1d5db !important;
    }

    .back-to-site-btn:hover {
      color: #2dd4bf !important;
      border-color: #2dd4bf !important;
    }

    .user-menu {
      position: relative;
    }

    .user-menu-button {
      display: flex !important;
      align-items: center;
      gap: 8px;
      color: #374151 !important;
      border: 1px solid #d1d5db !important;
      border-radius: 8px;
      padding: 8px 16px !important;
      font-size: 0.875rem !important;
    }

    .user-menu-button:hover {
      color: #2dd4bf !important;
      border-color: #2dd4bf !important;
      background-color: rgba(45, 212, 191, 0.05);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .user-menu-button mat-icon:first-child {
      font-size: 1.5rem !important;
      width: 1.5rem;
      height: 1.5rem;
    }

    .admin-nav {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9375rem !important;
      font-weight: 600 !important;
      padding: 12px 24px !important;
      border-radius: 12px !important;
      border: 1px solid #d1d5db !important;
      color: #6b7280 !important;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .nav-btn mat-icon {
      font-size: 1.25rem !important;
      width: 1.25rem;
      height: 1.25rem;
    }

    .nav-btn:hover {
      color: #2dd4bf !important;
      border-color: #2dd4bf !important;
      background-color: rgba(45, 212, 191, 0.05);
    }

    .nav-btn.active {
      color: #2dd4bf !important;
      border-color: #2dd4bf !important;
      background-color: rgba(45, 212, 191, 0.1);
      font-weight: 700 !important;
    }

    @media (max-width: 768px) {
      .admin-nav-header {
        flex-direction: column;
        align-items: stretch;
      }

      .back-to-site-btn,
      .user-menu-button {
        width: 100%;
        justify-content: center;
      }

      .user-info {
        align-items: center;
      }

      .admin-nav {
        flex-direction: column;
      }

      .nav-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AdminNavigationComponent {
  authService = inject(AuthService);

  async logout(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  goToMainSite(): void {
    window.open('/', '_blank');
  }

  canShowUserManagement(): boolean {
    const user = this.authService.getCurrentUser();
    return canManageUsers(user);
  }
}
