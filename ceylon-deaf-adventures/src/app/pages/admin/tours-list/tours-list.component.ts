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
        <h1 class="admin-title">
          <mat-icon>tour</mat-icon>
          Tours Management
        </h1>
        <p class="admin-subtitle">Manage all your tour offerings</p>
        
        <div class="header-actions">
          <button mat-stroked-button (click)="testConnection()" color="accent">
            <mat-icon>bug_report</mat-icon>
            Test Connection
          </button>
          <button mat-stroked-button (click)="loadTours()" color="primary">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button mat-raised-button color="primary" (click)="createTour()">
            <mat-icon>add</mat-icon>
            Add New Tour
          </button>
        </div>
      </div>

      <mat-card class="tours-card" *ngIf="!loading && tours.length === 0">
        <mat-card-content class="empty-state">
          <mat-icon class="empty-icon">tour</mat-icon>
          <h2>No Tours Found</h2>
          <p>Start by creating your first tour to showcase Sri Lankan adventures for the deaf community.</p>
          <button mat-raised-button color="primary" (click)="createTour()">
            <mat-icon>add</mat-icon>
            Create Your First Tour
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card class="tours-card" *ngIf="loading">
        <mat-card-content class="loading-state">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
          <p>Loading tours...</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="tours-card" *ngIf="!loading && tours.length > 0">
        <div class="tours-header">
          <h2>All Tours ({{ tours.length }})</h2>
          <div class="view-options">
            <button mat-icon-button [class.active]="viewMode === 'table'" (click)="viewMode = 'table'">
              <mat-icon>view_list</mat-icon>
            </button>
            <button mat-icon-button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">
              <mat-icon>grid_view</mat-icon>
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div *ngIf="viewMode === 'table'" class="table-container">
          <table mat-table [dataSource]="tours" class="tours-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let tour">
                <div class="tour-image">
                  <img [src]="(tour.images && tour.images[0]) || '/placeholder.png'" [alt]="tour.title">
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let tour">
                <div class="tour-info">
                  <h3>{{ tour.title }}</h3>
                  <p>{{ tour.shortDescription }}</p>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef>Details</th>
              <td mat-cell *matCellDef="let tour">
                <div class="tour-details">
                  <mat-chip-set>
                    <mat-chip>{{ tour.type | titlecase }}</mat-chip>
                    <mat-chip>{{ tour.durationDays }} days</mat-chip>
                    <mat-chip>{{ tour.currency }} {{ tour.priceDisplay }}</mat-chip>
                  </mat-chip-set>
                  <div class="locations">
                    <mat-icon>location_on</mat-icon>
                    {{ tour.location?.join(', ') }}
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let tour">
                <mat-chip [class]="tour.published ? 'published' : 'draft'">
                  <mat-icon>{{ tour.published ? 'visibility' : 'visibility_off' }}</mat-icon>
                  {{ tour.published ? 'Published' : 'Draft' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let tour">
                <div class="actions">
                  <button mat-icon-button color="primary" (click)="editTour(tour)" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="togglePublish(tour)" 
                    [matTooltip]="tour.published ? 'Unpublish' : 'Publish'">
                    <mat-icon>{{ tour.published ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteTour(tour)" matTooltip="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <!-- Grid View -->
        <div *ngIf="viewMode === 'grid'" class="grid-container">
          <div *ngFor="let tour of tours" class="tour-card">
            <div class="tour-card-image">
              <img [src]="(tour.images && tour.images[0]) || '/placeholder.png'" [alt]="tour.title">
              <div class="tour-card-overlay">
                <mat-chip [class]="tour.published ? 'published' : 'draft'">
                  {{ tour.published ? 'Published' : 'Draft' }}
                </mat-chip>
              </div>
            </div>
            <div class="tour-card-content">
              <h3>{{ tour.title }}</h3>
              <p>{{ tour.shortDescription }}</p>
              <div class="tour-card-details">
                <span>{{ tour.type | titlecase }}</span>
                <span>{{ tour.durationDays }} days</span>
                <span>{{ tour.currency }} {{ tour.priceDisplay }}</span>
              </div>
              <div class="tour-card-actions">
                <button mat-icon-button color="primary" (click)="editTour(tour)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="togglePublish(tour)">
                  <mat-icon>{{ tour.published ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTour(tour)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .admin-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 16px 0;
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
      margin: 0 0 24px 0;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .tours-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .empty-state, .loading-state {
      text-align: center;
      padding: 64px 32px;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .tours-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      margin-bottom: 16px;
    }

    .tours-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .view-options {
      display: flex;
      gap: 8px;
    }

    .view-options button.active {
      background-color: #2dd4bf;
      color: white;
    }

    .table-container {
      overflow-x: auto;
    }

    .tours-table {
      width: 100%;
    }

    .tour-image img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    .tour-info h3 {
      margin: 0 0 4px 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .tour-info p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tour-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .locations {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .locations mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .published {
      background-color: #dcfce7 !important;
      color: #166534 !important;
    }

    .draft {
      background-color: #fef3c7 !important;
      color: #92400e !important;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .tour-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .tour-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .tour-card-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .tour-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tour-card-overlay {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .tour-card-content {
      padding: 20px;
    }

    .tour-card-content h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .tour-card-content p {
      margin: 0 0 16px 0;
      font-size: 0.875rem;
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tour-card-details {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .tour-card-details span {
      background-color: #f1f5f9;
      color: #475569;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .tour-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 24px 16px;
      }

      .admin-title {
        font-size: 2rem;
      }

      .header-actions {
        flex-direction: column;
        align-items: center;
      }

      .tours-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .grid-container {
        grid-template-columns: 1fr;
        padding: 16px;
      }
    }
  `]
})
export class ToursListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tours: Tour[] = [];
  loading = false;
  viewMode: 'table' | 'grid' = 'table';
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

  async testConnection() {
    console.log('Testing Firebase connection from Tours List...');
    this.debugService.logFirebaseConfig();
    await this.debugService.testFirestoreConnection();
  }

  loadTours() {
    this.loading = true;
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
          this.snackBar.open('Error loading tours: ' + error.message, 'Close', { duration: 5000 });
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

      // Update local state
      const index = this.tours.findIndex(t => t.id === tour.id);
      if (index !== -1) {
        this.tours[index] = { ...this.tours[index], published: newStatus };
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