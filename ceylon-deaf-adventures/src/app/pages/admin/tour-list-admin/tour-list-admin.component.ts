import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { Router } from '@angular/router';
import { ToursService } from '../../../services/tours.service';
import { Tour } from '../../../models/tour';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tour-list-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>
      <div class="admin-header">
        <div class="header-content">
          <h1 class="admin-title">
            <mat-icon>manage_search</mat-icon>
            Manage Tours
          </h1>
          <p class="admin-subtitle">View, edit, and manage all tours</p>
        </div>
        <button mat-raised-button color="primary" (click)="createNewTour()">
          <mat-icon>add</mat-icon>
          Create New Tour
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p class="loading-text">Loading tours...</p>
      </div>

      <!-- Tours List -->
      <div *ngIf="!isLoading && tours.length > 0" class="tours-container">
        <mat-card *ngFor="let tour of tours" class="tour-card">
          <div class="tour-image-container">
            <img 
              [src]="tour.images[0] || 'tour-placeholder.jpg'" 
              [alt]="tour.title"
              class="tour-image"
              (error)="onImageError($event)"
            >
            <div class="tour-badge" [class.published]="tour.published" [class.draft]="!tour.published">
              {{ tour.published ? 'Published' : 'Draft' }}
            </div>
          </div>

          <mat-card-content class="tour-content">
            <div class="tour-header">
              <h3 class="tour-title">{{ tour.title }}</h3>
              <mat-chip class="type-chip">
                <mat-icon matChipAvatar>{{ getTypeIcon(tour.type) }}</mat-icon>
                {{ tour.type | titlecase }}
              </mat-chip>
            </div>

            <p class="tour-description">{{ tour.shortDescription }}</p>

            <div class="tour-details">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>{{ tour.durationDays }} Day{{ tour.durationDays !== 1 ? 's' : '' }}</span>
              </div>
              <div class="detail-item">
                <mat-icon>groups</mat-icon>
                <span>Up to {{ tour.capacity }}</span>
              </div>
              <div class="detail-item">
                <mat-icon>payments</mat-icon>
                <span>{{ tour.currency }} {{ tour.priceDisplay }}</span>
              </div>
            </div>

            <div class="tour-locations">
              <mat-icon>place</mat-icon>
              <span>{{ tour.location.slice(0, 3).join(', ') }}</span>
              <span *ngIf="tour.location.length > 3" class="more-locations">
                +{{ tour.location.length - 3 }} more
              </span>
            </div>

            <div class="tour-actions">
              <button mat-button color="primary" (click)="editTour(tour)" matTooltip="Edit Tour">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="accent" (click)="togglePublish(tour)" 
                [matTooltip]="tour.published ? 'Unpublish Tour' : 'Publish Tour'">
                <mat-icon>{{ tour.published ? 'visibility_off' : 'visibility' }}</mat-icon>
                {{ tour.published ? 'Unpublish' : 'Publish' }}
              </button>
              <button mat-button color="warn" (click)="deleteTour(tour)" matTooltip="Delete Tour">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && tours.length === 0" class="empty-state">
        <mat-icon class="empty-icon">inventory_2</mat-icon>
        <h3 class="empty-title">No tours yet</h3>
        <p class="empty-description">Create your first tour to get started</p>
        <button mat-raised-button color="primary" (click)="createNewTour()">
          <mat-icon>add</mat-icon>
          Create Tour
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
      flex-wrap: wrap;
      gap: 24px;
    }

    .header-content {
      flex: 1;
    }

    .admin-title {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .admin-title mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #2dd4bf;
    }

    .admin-subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 24px;
    }

    .loading-text {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0;
    }

    .tours-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }

    .tour-card {
      border-radius: 16px !important;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .tour-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
    }

    .tour-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .tour-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tour-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tour-badge.published {
      background: #10b981;
      color: white;
    }

    .tour-badge.draft {
      background: #f59e0b;
      color: white;
    }

    .tour-content {
      padding: 24px !important;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tour-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .tour-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      line-height: 1.3;
      flex: 1;
    }

    .type-chip {
      background-color: rgba(45, 212, 191, 0.1) !important;
      color: #2dd4bf !important;
      font-size: 0.75rem !important;
      height: 32px !important;
      border-radius: 16px !important;
    }

    .tour-description {
      color: #6b7280;
      line-height: 1.6;
      font-size: 0.9rem;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tour-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .detail-item mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      color: #2dd4bf;
    }

    .tour-locations {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .tour-locations mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      color: #2dd4bf;
    }

    .more-locations {
      font-weight: 600;
      color: #2dd4bf;
    }

    .tour-actions {
      display: flex;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }

    .tour-actions button {
      flex: 1;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 24px;
      text-align: center;
    }

    .empty-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #cbd5e1;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .empty-description {
      font-size: 1.125rem;
      color: #6b7280;
      max-width: 400px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 24px 16px;
      }

      .admin-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .admin-header button {
        width: 100%;
      }

      .admin-title {
        font-size: 2rem;
      }

      .tours-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TourListAdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tours: Tour[] = [];
  isLoading = true;

  constructor(
    private toursService: ToursService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadTours();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTours() {
    this.isLoading = true;
    this.toursService.listTours()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tours) => {
          this.tours = tours;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading tours:', error);
          this.snackBar.open('Error loading tours', 'Close', { duration: 3000 });
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  createNewTour() {
    this.router.navigate(['/admin/tours/new']);
  }

  editTour(tour: Tour) {
    this.router.navigate(['/admin/tours/edit', tour.id]);
  }

  async togglePublish(tour: Tour) {
    try {
      await this.toursService.updateTour(tour.id, {
        published: !tour.published
      });

      this.snackBar.open(
        `Tour ${tour.published ? 'unpublished' : 'published'} successfully`,
        'Close',
        { duration: 3000 }
      );

      this.loadTours();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      this.snackBar.open('Error updating tour', 'Close', { duration: 3000 });
    }
  }

  async deleteTour(tour: Tour) {
    const confirmed = confirm(
      `Are you sure you want to delete "${tour.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await this.toursService.deleteTour(tour.id);
      this.snackBar.open('Tour deleted successfully', 'Close', { duration: 3000 });
      this.loadTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      this.snackBar.open('Error deleting tour', 'Close', { duration: 3000 });
    }
  }

  getTypeIcon(type: string): string {
    const icons = {
      adventure: 'hiking',
      group: 'groups',
      private: 'person',
      deaf_guide: 'accessibility'
    };
    return icons[type as keyof typeof icons] || 'tour';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.jpg';
  }
}