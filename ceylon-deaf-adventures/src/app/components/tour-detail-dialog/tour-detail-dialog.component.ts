import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { LucideAngularModule } from 'lucide-angular';
import { Tour } from '../../models/tour';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';

@Component({
  selector: 'app-tour-detail-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LucideAngularModule
  ],
  styles: [`
    .dialog-container {
      background: white;
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    
    .hero-section {
      position: relative;
      height: 300px;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    
    .hero-image:hover {
      transform: scale(1.02);
    }
    
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
    }
    
    .hero-content {
      position: absolute;
      bottom: 2rem;
      left: 2rem;
      right: 2rem;
      color: white;
    }
    
    .hero-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.5) !important;
      color: white !important;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
    }
    
    .close-button:hover {
      background: rgba(0, 0, 0, 0.7) !important;
      transform: scale(1.05);
    }
    
    .content-section {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }
    
    .price-duration-card {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .price-info {
      text-align: left;
    }
    
    .price-amount {
      font-size: 2.5rem;
      font-weight: 700;
      color: #3b82f6;
      line-height: 1;
    }
    
    .price-currency {
      font-size: 1rem;
      color: #64748b;
      font-weight: 500;
    }
    
    .price-per {
      color: #64748b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .duration-info {
      text-align: right;
    }
    
    .duration-amount {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1;
    }
    
    .duration-label {
      color: #64748b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 2rem 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .section-title:first-of-type {
      margin-top: 0;
    }
    
    .location-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .chip-location {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .description-text {
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    .short-description {
      font-weight: 500;
      color: #374151;
    }
    
    .feature-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0;
    }
    
    .chip-feature {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      border: 1px solid rgba(99, 102, 241, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .accessibility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0 2rem 0;
    }
    
    .accessibility-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
    }
    
    .icon-success {
      color: #10b981;
    }
    
    .icon-unavailable {
      color: #ef4444;
    }
    
    .accessibility-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0 2rem 0;
    }
    
    .detail-card {
      padding: 1.25rem;
      background: #f8fafc;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
    }
    
    .detail-label {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    
    .detail-value {
      color: #64748b;
      font-size: 0.875rem;
    }
    
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 2rem 0;
    }
    
    .actions-bar {
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 1rem;
      flex-shrink: 0;
    }
    
    .btn-close {
      flex: 1;
      background: white;
      color: #64748b;
      border: 1px solid #cbd5e1;
      padding: 0.875rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-close:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    
    .btn-book {
      flex: 2;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.875rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn-book:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
    
    /* Scrollbar styling */
    .content-section::-webkit-scrollbar {
      width: 6px;
    }
    
    .content-section::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    .content-section::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    
    .content-section::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    @media (max-width: 768px) {
      .hero-content {
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
      }
      
      .hero-title {
        font-size: 1.5rem;
      }
      
      .content-section {
        padding: 1.5rem;
      }
      
      .price-duration-card {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
      }
      
      .duration-info {
        text-align: center;
      }
      
      .accessibility-grid {
        grid-template-columns: 1fr;
      }
      
      .details-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-bar {
        flex-direction: column;
        padding: 1.5rem;
      }
    }
  `],
  template: `
    <div class="dialog-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <img 
          [src]="data.tour.images[0] || '/placeholder.svg?height=300&width=700'" 
          [alt]="data.tour.title"
          class="hero-image"
        >
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h2 class="hero-title">{{ data.tour.title }}</h2>
          <div class="hero-badge">
            <lucide-icon [name]="getTypeIcon(data.tour.type)" [size]="16"></lucide-icon>
            <span>{{ data.tour.type | titlecase }}</span>
          </div>
        </div>
        <button mat-icon-button class="close-button" (click)="onClose()">
          <lucide-icon name="x" [size]="24"></lucide-icon>
        </button>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <!-- Price and Duration -->
        <div class="price-duration-card">
          <div class="price-info">
            <div class="price-amount">
              <span class="price-currency">{{ data.tour.currency }}</span>
            </div>
            <div class="price-per">per person</div>
          </div>
          <div class="duration-info">
            <div class="duration-amount">
              {{ data.tour.durationDays }} {{ data.tour.durationDays === 1 ? 'Day' : 'Days' }}
            </div>
            <div class="duration-label">Duration</div>
          </div>
        </div>

        <!-- Locations -->
        <h3 class="section-title">
          <lucide-icon name="map-pin" [size]="20" style="color: #3b82f6;"></lucide-icon>
          Locations
        </h3>
        <div class="location-chips">
          @for (location of data.tour.location; track location) {
            <span class="chip-location">{{ location }}</span>
          }
        </div>

        <hr class="divider">

        <!-- Description -->
        <h3 class="section-title">About This Tour</h3>
        <p class="description-text short-description">{{ data.tour.shortDescription }}</p>
        <p class="description-text">{{ data.tour.fullDescription }}</p>

        <hr class="divider">

        <!-- Features -->
        <h3 class="section-title">
          <lucide-icon name="star" [size]="20" style="color: #3b82f6;"></lucide-icon>
          Tour Features
        </h3>
        <div class="feature-chips">
          @for (feature of data.tour.features; track feature) {
            <span class="chip-feature">{{ feature }}</span>
          }
        </div>

        <hr class="divider">

        <!-- Accessibility Features -->
        <h3 class="section-title">
          <lucide-icon name="accessibility" [size]="20" style="color: #3b82f6;"></lucide-icon>
          Accessibility Features
        </h3>
        <div class="accessibility-grid">
          <div class="accessibility-item">
            <lucide-icon 
              [name]="data.tour.accessibility.visualAlarms ? 'check-circle' : 'x-circle'" 
              [size]="20"
              [class]="data.tour.accessibility.visualAlarms ? 'icon-success' : 'icon-unavailable'"
            ></lucide-icon>
            <span class="accessibility-label">Visual Alarms</span>
          </div>
          <div class="accessibility-item">
            <lucide-icon 
              [name]="data.tour.accessibility.staffTrained ? 'check-circle' : 'x-circle'" 
              [size]="20"
              [class]="data.tour.accessibility.staffTrained ? 'icon-success' : 'icon-unavailable'"
            ></lucide-icon>
            <span class="accessibility-label">Trained Staff</span>
          </div>
          <div class="accessibility-item">
            <lucide-icon 
              [name]="data.tour.accessibility.ramps ? 'check-circle' : 'x-circle'" 
              [size]="20"
              [class]="data.tour.accessibility.ramps ? 'icon-success' : 'icon-unavailable'"
            ></lucide-icon>
            <span class="accessibility-label">Wheelchair Ramps</span>
          </div>
          <div class="accessibility-item">
            <lucide-icon 
              [name]="data.tour.accessibility.captionsProvided ? 'check-circle' : 'x-circle'" 
              [size]="20"
              [class]="data.tour.accessibility.captionsProvided ? 'icon-success' : 'icon-unavailable'"
            ></lucide-icon>
            <span class="accessibility-label">Captions Provided</span>
          </div>
        </div>

        <hr class="divider">

        <!-- Tour Details -->
        <h3 class="section-title">
          <lucide-icon name="info" [size]="20" style="color: #3b82f6;"></lucide-icon>
          Tour Details
        </h3>
        <div class="details-grid">
          <div class="detail-card">
            <div class="detail-label">Group Size</div>
            <div class="detail-value">Up to {{ data.tour.capacity }} people</div>
          </div>
          <div class="detail-card">
            <div class="detail-label">Next Available</div>
            <div class="detail-value">{{ getNextAvailableDate() }}</div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="actions-bar">
        <button class="btn-close" (click)="onClose()">
          Close
        </button>
        <button class="btn-book" (click)="openBookingDialog()">
          <lucide-icon name="calendar" [size]="20"></lucide-icon>
          Book This Tour
        </button>
      </div>
    </div>
  `
})
export class TourDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TourDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tour: Tour },
    private dialog: MatDialog
  ) { }

  onClose() {
    this.dialogRef.close();
  }

  openBookingDialog() {
    this.dialogRef.close();
    this.dialog.open(BookingDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { tour: this.data.tour },
      panelClass: 'custom-dialog-container'
    });
  }

  getTypeIcon(type: string): string {
    const icons = {
      adventure: 'mountain',
      group: 'users',
      private: 'home',
      deaf_guide: 'eye'
    };
    return icons[type as keyof typeof icons] || 'mountain';
  }

  getNextAvailableDate(): string {
    if (this.data.tour.nextAvailableDates && this.data.tour.nextAvailableDates.length > 0) {
      const date = this.data.tour.nextAvailableDates[0];
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return 'Contact us for availability';
  }
}