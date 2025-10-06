import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookingsService } from '../../../services/bookings.service';
import { FirebaseDebugService } from '../../../services/firebase-debug.service';
import { Booking } from '../../../models/booking';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-bookings-list',
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
    MatTooltipModule,
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>
      
      <div class="admin-header">
        <h1 class="admin-title">
          <mat-icon>event_note</mat-icon>
          Bookings Management
        </h1>
        <p class="admin-subtitle">View and manage all tour bookings</p>
        
        <div class="header-actions">
          <button mat-stroked-button (click)="testConnection()" color="accent">
            <mat-icon>bug_report</mat-icon>
            Test Connection
          </button>
          <button mat-stroked-button (click)="loadBookings()" color="primary">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
      </div>

      <mat-card class="bookings-card" *ngIf="!loading && bookings.length === 0">
        <mat-card-content class="empty-state">
          <mat-icon class="empty-icon">event_note</mat-icon>
          <h2>No Bookings Found</h2>
          <p>No tour bookings have been submitted yet. Bookings will appear here once users start making reservations.</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="bookings-card" *ngIf="loading">
        <mat-card-content class="loading-state">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
          <p>Loading bookings...</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="bookings-card" *ngIf="!loading && bookings.length > 0">
        <div class="bookings-header">
          <h2>All Bookings ({{ bookings.length }})</h2>
          <div class="status-summary">
            <mat-chip class="pending">Pending: {{ getStatusCount('pending') }}</mat-chip>
            <mat-chip class="confirmed">Confirmed: {{ getStatusCount('confirmed') }}</mat-chip>
            <mat-chip class="rejected">Rejected: {{ getStatusCount('rejected') }}</mat-chip>
            <mat-chip class="cancelled">Cancelled: {{ getStatusCount('cancelled') }}</mat-chip>
          </div>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="bookings" class="bookings-table">
            <ng-container matColumnDef="guest">
              <th mat-header-cell *matHeaderCellDef>Guest</th>
              <td mat-cell *matCellDef="let booking">
                <div class="guest-info">
                  <div class="guest-name">{{ booking.guestName || 'N/A' }}</div>
                  <div class="guest-email">{{ booking.guestEmail || 'N/A' }}</div>
                  <div class="guest-phone" *ngIf="booking.guestPhone">{{ booking.guestPhone }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="tour">
              <th mat-header-cell *matHeaderCellDef>Tour</th>
              <td mat-cell *matCellDef="let booking">
                <div class="tour-info">
                  <div class="tour-title">{{ booking.tourTitle || booking.tourId }}</div>
                  <div class="tour-date">{{ formatDate(booking.tourDate) }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef>Details</th>
              <td mat-cell *matCellDef="let booking">
                <div class="booking-details">
                  <div class="detail-item">
                    <mat-icon>groups</mat-icon>
                    <span>{{ booking.numPeople }} {{ booking.numPeople === 1 ? 'person' : 'people' }}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ booking.numDays || 1 }} {{ (booking.numDays || 1) === 1 ? 'day' : 'days' }}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>home</mat-icon>
                    <span>{{ booking.stayType }}</span>
                  </div>
                  <div class="detail-item" *ngIf="booking.guideRequired">
                    <mat-icon>accessibility</mat-icon>
                    <span>Deaf Guide Required</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let booking">
                <div class="price-info">
                  <div class="price-amount">\${{ booking.totalPrice || 0 }}</div>
                  <div class="price-per">Total Bid</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let booking">
                <mat-chip [class]="booking.status">
                  <mat-icon>{{ getStatusIcon(booking.status) }}</mat-icon>
                  {{ booking.status | titlecase }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="created">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let booking">
                <div class="created-info">
                  <div class="created-date">{{ formatDate(booking.createdAt) }}</div>
                  <div class="time-ago">{{ getTimeAgo(booking.createdAt) }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let booking">
                <div class="actions">
                  <button mat-icon-button color="primary" (click)="viewBooking(booking)" matTooltip="View Details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="updateStatus(booking, 'confirmed')" 
                    *ngIf="booking.status === 'pending'" matTooltip="Confirm">
                    <mat-icon>check</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="updateStatus(booking, 'rejected')" 
                    *ngIf="booking.status === 'pending'" matTooltip="Reject">
                    <mat-icon>close</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="updateStatus(booking, 'cancelled')" 
                    *ngIf="booking.status === 'confirmed'" matTooltip="Cancel">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
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

    .bookings-card {
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

    .bookings-header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .bookings-header h2 {
      margin: 0 0 16px 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .status-summary {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .table-container {
      overflow-x: auto;
    }

    .bookings-table {
      width: 100%;
    }

    .guest-info .guest-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .guest-info .guest-email {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 2px;
    }

    .guest-info .guest-phone {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .tour-info .tour-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .tour-info .tour-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .booking-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .detail-item mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .price-info {
      text-align: center;
    }

    .price-amount {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
    }

    .price-per {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .created-info .created-date {
      font-size: 0.875rem;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .created-info .time-ago {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .pending {
      background-color: #fef3c7 !important;
      color: #92400e !important;
    }

    .confirmed {
      background-color: #dcfce7 !important;
      color: #166534 !important;
    }

    .rejected {
      background-color: #fee2e2 !important;
      color: #991b1b !important;
    }

    .cancelled {
      background-color: #f1f5f9 !important;
      color: #475569 !important;
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

      .status-summary {
        justify-content: center;
      }

      .bookings-table {
        font-size: 0.875rem;
      }
    }
  `]
})
export class BookingsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  bookings: Booking[] = [];
  loading = false;
  displayedColumns: string[] = ['guest', 'tour', 'details', 'price', 'status', 'created', 'actions'];

  constructor(
    private bookingsService: BookingsService,
    private debugService: FirebaseDebugService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async testConnection() {
    console.log('Testing Firebase connection from Bookings List...');
    this.debugService.logFirebaseConfig();
    await this.debugService.testFirestoreConnection();
  }

  loadBookings() {
    this.loading = true;
    this.cdr.markForCheck();

    this.bookingsService.listAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings) => {
          console.log('Loaded bookings:', bookings);
          this.bookings = bookings.sort((a, b) => {
            const aTime = this.getTimestamp(a.createdAt);
            const bTime = this.getTimestamp(b.createdAt);
            return bTime - aTime;
          });
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.snackBar.open('Error loading bookings: ' + error.message, 'Close', { duration: 5000 });
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  getStatusCount(status: string): number {
    return this.bookings.filter(booking => booking.status === status).length;
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getTimeAgo(timestamp: any): string {
    if (!timestamp) return 'Unknown';
    
    const now = Date.now();
    const time = this.getTimestamp(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  private getTimestamp(timestamp: any): number {
    if (timestamp?.toDate) {
      return timestamp.toDate().getTime();
    } else if (timestamp instanceof Date) {
      return timestamp.getTime();
    } else {
      return new Date(timestamp).getTime();
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'hourglass_empty';
      case 'confirmed':
        return 'check_circle';
      case 'rejected':
        return 'cancel';
      case 'cancelled':
        return 'block';
      default:
        return 'help';
    }
  }

  async updateStatus(booking: Booking, newStatus: 'pending' | 'confirmed' | 'rejected' | 'cancelled') {
    try {
      await this.bookingsService.updateBookingStatus(booking.id!, newStatus);
      
      // Update local state
      const index = this.bookings.findIndex(b => b.id === booking.id);
      if (index !== -1) {
        this.bookings[index] = { ...this.bookings[index], status: newStatus };
        this.cdr.markForCheck();
      }
      
      this.snackBar.open(
        `Booking ${newStatus} successfully!`, 
        'Close', 
        { duration: 3000 }
      );
    } catch (error: any) {
      this.snackBar.open('Error updating booking: ' + error.message, 'Close', { duration: 5000 });
    }
  }

  viewBooking(booking: Booking) {
    console.log('View booking details:', booking);
    // TODO: Implement booking details dialog
    this.snackBar.open('Booking details: ' + booking.guestName + ' - ' + booking.guestEmail, 'Close', { duration: 5000 });
  }
}