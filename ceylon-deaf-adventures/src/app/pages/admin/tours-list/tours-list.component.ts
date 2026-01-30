import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ToursService } from '../../../services/tours.service';
import { FirebaseDebugService } from '../../../services/firebase-debug.service';
import { Tour } from '../../../models/tour';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-tours-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    AdminNavigationComponent,
    MatTooltipModule
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>
      
      <div class="admin-header">
        <div class="header-content">
            <h1 class="admin-title">
            <mat-icon>tour</mat-icon>
            Tours Management
            </h1>
            <p class="admin-subtitle">Manage, edit, and publish your tour packages.</p>
        </div>
        
        <div class="header-actions">
          <button mat-stroked-button (click)="loadTours()" [disabled]="loading" color="primary">
            <mat-icon [class.spin]="loading">refresh</mat-icon>
            Refresh
          </button>
          <button mat-raised-button color="primary" (click)="createTour()">
            <mat-icon>add</mat-icon>
            New Tour
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading tours...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-container">
        <mat-icon color="warn">error_outline</mat-icon>
        <h3>Failed to load tours</h3>
        <p>{{ error }}</p>
        <button mat-stroked-button color="primary" (click)="loadTours()">Try Again</button>
      </div>

      <!-- Empty State -->
      <mat-card class="admin-card" *ngIf="!loading && !error && tours.length === 0">
        <mat-card-content class="empty-state">
          <div class="empty-icon-circle">
            <mat-icon>tour</mat-icon>
          </div>
          <h2>No Tours Found</h2>
          <p>Get started by creating your first tour package.</p>
          <button mat-raised-button color="primary" (click)="createTour()">
            <mat-icon>add</mat-icon>
            Create Tour
          </button>
        </mat-card-content>
      </mat-card>

      <!-- Data Table -->
      <mat-card class="admin-card" *ngIf="!loading && !error && tours.length > 0">
        <div class="table-container">
          <table mat-table [dataSource]="tours" class="admin-table">
            
            <!-- Image Column -->
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let tour">
                <div class="image-wrapper">
                  <img [src]="(tour.images && tour.images[0]) || '/placeholder.png'" 
                       [alt]="tour.title"
                       onerror="this.src='/assets/placeholder.jpg'">
                </div>
              </td>
            </ng-container>

            <!-- Title & Info Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Tour Details</th>
              <td mat-cell *matCellDef="let tour">
                <div class="tour-info">
                  <span class="tour-title">{{ tour.title }}</span>
                  <div class="tour-meta">
                    <span class="meta-item">
                        <mat-icon>schedule</mat-icon> {{ tour.durationDays }} Days
                    </span>
                    <span class="meta-item">
                        <mat-icon>category</mat-icon> {{ tour.type | titlecase }}
                    </span>
                     <span class="meta-item">
                        <mat-icon>place</mat-icon> {{ tour.location?.length }} Stops
                    </span>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Price Column -->
            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let tour">
                <span class="price-tag">
                    {{ tour.currency }} {{ tour.priceDisplay }}
                </span>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let tour">
                <span class="status-badge" [class.published]="tour.published" [class.draft]="!tour.published">
                  <div class="status-dot"></div>
                  {{ tour.published ? 'Published' : 'Draft' }}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let tour">
                <div class="action-buttons">
                  <button mat-icon-button (click)="editTour(tour)" matTooltip="Edit Tour" class="action-btn edit-btn">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="togglePublish(tour)" 
                          [matTooltip]="tour.published ? 'Unpublish' : 'Publish'"
                          class="action-btn"
                          [class.publish-btn]="!tour.published"
                          [class.unpublish-btn]="tour.published">
                    <mat-icon>{{ tour.published ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteTour(tour)" matTooltip="Delete Tour" class="action-btn delete-btn">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="tour-row"></tr>
          </table>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
        --primary: #0b1f3a;
        --accent: #f4b416;
        --text: #1f2937;
        --text-light: #6b7280;
        --bg-light: #f3f4f6;
        --card-bg: #ffffff;
        --danger: #ef4444;
        --success: #10b981;
    }

    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* Header */
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      gap: 24px;
      flex-wrap: wrap;
    }

    .admin-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      margin: 0 0 8px 0;
    }

    .admin-title mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: var(--accent);
    }

    .admin-subtitle {
      font-size: 1rem;
      color: var(--text-light);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    /* Cards */
    .admin-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      border: 1px solid #e5e7eb;
      background: var(--card-bg);
      overflow: hidden;
    }

    /* Table */
    .table-container {
        overflow-x: auto;
    }

    .admin-table {
      width: 100%;
    }

    .admin-table th.mat-header-cell {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-light);
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
        background-color: #f9fafb;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .admin-table td.mat-cell {
        padding: 20px 24px;
        border-bottom: 1px solid #f3f4f6;
        color: var(--text);
        font-size: 0.95rem;
    }

    .tour-row:hover {
        background-color: #f9fafb;
    }

    .tour-row:last-child td {
        border-bottom: none;
    }

    /* Image */
    .image-wrapper {
        width: 80px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        background-color: #f3f4f6;
    }

    .image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Info */
    .tour-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .tour-title {
        font-weight: 600;
        color: var(--primary);
        font-size: 1rem;
    }

    .tour-meta {
        display: flex;
        gap: 12px;
        font-size: 0.8rem;
        color: var(--text-light);
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .meta-item mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
    }

    /* Price */
    .price-tag {
        font-weight: 600;
        color: var(--text);
        background: #f3f4f6;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.875rem;
    }

    /* Status */
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }

    .published {
        background-color: #ecfdf5;
        color: #065f46;
    }

    .published .status-dot {
        background-color: #059669;
    }

    .draft {
        background-color: #fffbeb;
        color: #92400e;
    }

    .draft .status-dot {
        background-color: #d97706;
    }

    /* Actions */
    .action-buttons {
        display: flex;
        gap: 4px;
    }

    .action-btn {
        width: 36px;
        height: 36px;
        line-height: 36px;
        border-radius: 8px;
    }
    
    .action-btn mat-icon {
        font-size: 20px;
    }

    .edit-btn { color: var(--primary); }
    .edit-btn:hover { background-color: #e0f2fe; }

    .publish-btn { color: #059669; }
    .publish-btn:hover { background-color: #d1fae5; }
    
    .unpublish-btn { color: #d97706; }
    .unpublish-btn:hover { background-color: #fef3c7; }

    .delete-btn { color: var(--danger); opacity: 0.7; }
    .delete-btn:hover { background-color: #fee2e2; opacity: 1; }

    /* States */
    .loading-container, .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px;
        background: white;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        text-align: center;
        gap: 16px;
    }
    
    .loading-container p, .error-container p {
        color: var(--text-light);
        margin: 0;
    }

    .error-container mat-icon { font-size: 48px; width: 48px; height: 48px; }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 24px;
        text-align: center;
    }

    .empty-icon-circle {
        width: 80px;
        height: 80px;
        background-color: #f3f4f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
    }

    .empty-icon-circle mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #9ca3af;
    }

    .empty-state h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text);
        margin: 0 0 8px 0;
    }

    .empty-state p {
        color: var(--text-light);
        margin: 0 0 24px 0;
        max-width: 400px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }

    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .header-actions {
            width: 100%;
        }
        
        .header-actions button {
            flex: 1;
        }
    }
  `]
})
export class ToursListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tours: Tour[] = [];
  loading = false;
  error: string | null = null;
  displayedColumns: string[] = ['image', 'title', 'details', 'status', 'actions'];

  constructor(
    private toursService: ToursService,
    private debugService: FirebaseDebugService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadTours();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTours() {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.toursService.getAllToursAdmin()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tours) => {
          console.log('Loaded tours:', tours);
          this.tours = tours;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading tours:', error);
          this.error = error.message;
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  createTour() {
    this.router.navigate(['/admin/tours/new']);
  }

  editTour(tour: Tour) {
    this.router.navigate(['/admin/tours/edit', tour.id]);
  }

  async togglePublish(tour: Tour) {
    try {
      const newStatus = !tour.published;
      await this.toursService.updateTour(tour.id!, { published: newStatus });

      // Update local state without full reload
      const index = this.tours.findIndex(t => t.id === tour.id);
      if (index !== -1) {
        this.tours[index] = { ...this.tours[index], published: newStatus };
        this.tours = [...this.tours]; // Trigger change detection for table
        this.cdr.markForCheck();
      }

      this.snackBar.open(
        `Tour ${newStatus ? 'published' : 'unpublished'} successfully!`,
        'Close',
        { duration: 3000 }
      );
    } catch (error: any) {
      this.snackBar.open('Error updating tour: ' + error.message, 'Close', { duration: 5000 });
    }
  }

  async deleteTour(tour: Tour) {
    if (!confirm(`Are you sure you want to delete "${tour.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await this.toursService.deleteTour(tour.id!);

      // Update local state
      this.tours = this.tours.filter(t => t.id !== tour.id);
      this.cdr.markForCheck();

      this.snackBar.open('Tour deleted successfully!', 'Close', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open('Error deleting tour: ' + error.message, 'Close', { duration: 5000 });
    }
  }
}