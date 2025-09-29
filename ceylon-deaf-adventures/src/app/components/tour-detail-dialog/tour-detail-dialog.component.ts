import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
    MatCardModule,
    MatRippleModule,
    MatBadgeModule,
    MatProgressBarModule
  ],
  template: `
    <div class="dialog-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <img 
          [src]="data.tour.images[0] || '/placeholder.svg?height=400&width=800'" 
          [alt]="data.tour.title"
          class="hero-image"
        >
        <div class="hero-overlay">
          <div class="hero-gradient"></div>
        </div>
        <div class="hero-content">
          <div class="hero-badges">
            <div class="hero-badge type-badge">
              <mat-icon class="badge-icon">{{ getTypeIcon(data.tour.type) }}</mat-icon>
              <span class="badge-text">{{ data.tour.type | titlecase }}</span>
            </div>
            <div class="hero-badge duration-badge">
              <mat-icon class="badge-icon">schedule</mat-icon>
              <span class="badge-text">{{ data.tour.durationDays }}{{ data.tour.durationDays === 1 ? ' Day' : ' Days' }}</span>
            </div>
          </div>
          <h2 class="hero-title">{{ data.tour.title }}</h2>
          <p class="hero-subtitle">{{ data.tour.shortDescription }}</p>
        </div>
        <button mat-icon-button class="close-button" (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <!-- Price and Capacity Card -->
        <mat-card class="info-card price-card">
          <mat-card-content class="price-content">
            <div class="price-info">
              <div class="price-main">
                <span class="currency">{{ data.tour.currency }}</span>
                <span class="amount">{{ data.tour.priceDisplay }}</span>
              </div>
              <span class="price-label">per person</span>
            </div>
            <mat-divider class="price-divider"></mat-divider>
            <div class="capacity-info">
              <div class="capacity-header">
                <mat-icon class="capacity-icon">groups</mat-icon>
                <span class="capacity-label">Group Size</span>
              </div>
              <div class="capacity-details">
                <span class="capacity-number">Up to {{ data.tour.capacity }}</span>
                <span class="capacity-text">people</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Locations Section -->
        <div class="content-section-wrapper">
          <div class="section-header">
            <mat-icon class="section-icon">place</mat-icon>
            <h3 class="section-title">Destinations</h3>
          </div>
          <div class="locations-grid">
            <mat-chip-listbox class="location-chips">
              <mat-chip *ngFor="let location of data.tour.location; trackBy: trackByLocation" class="location-chip" matRipple>
                <mat-icon matChipAvatar>place</mat-icon>
                {{ location }}
              </mat-chip>
            </mat-chip-listbox>
          </div>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <!-- Description Section -->
        <div class="content-section-wrapper">
          <div class="section-header">
            <mat-icon class="section-icon">description</mat-icon>
            <h3 class="section-title">About This Tour</h3>
          </div>
          <div class="description-content">
            <p class="description-short">{{ data.tour.shortDescription }}</p>
            <p class="description-full">{{ data.tour.fullDescription }}</p>
          </div>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <!-- Features Section -->
        <div class="content-section-wrapper">
          <div class="section-header">
            <mat-icon class="section-icon">star</mat-icon>
            <h3 class="section-title">Tour Highlights</h3>
          </div>
          <div class="features-grid">
            <mat-card *ngFor="let feature of data.tour.features; trackBy: trackByFeature" class="feature-card" matRipple>
              <mat-card-content class="feature-content">
                <mat-icon class="feature-icon">check_circle</mat-icon>
                <span class="feature-text">{{ feature }}</span>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <!-- Accessibility Features Section -->
        <div class="content-section-wrapper">
          <div class="section-header">
            <mat-icon class="section-icon">accessible</mat-icon>
            <h3 class="section-title">Accessibility Features</h3>
          </div>
          <div class="accessibility-grid">
            <mat-card class="accessibility-card" matRipple>
              <mat-card-content class="accessibility-content">
                <div class="accessibility-item">
                  <mat-icon 
                    [class]="data.tour.accessibility.visualAlarms ? 'icon-success' : 'icon-unavailable'"
                  >
                    {{ data.tour.accessibility.visualAlarms ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                  <div class="accessibility-info">
                    <span class="accessibility-label">Visual Alarms</span>
                    <span class="accessibility-status">{{ data.tour.accessibility.visualAlarms ? 'Available' : 'Not Available' }}</span>
                  </div>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="data.tour.accessibility.visualAlarms ? 100 : 0"
                  [color]="data.tour.accessibility.visualAlarms ? 'primary' : 'warn'"
                  class="accessibility-progress"
                ></mat-progress-bar>
              </mat-card-content>
            </mat-card>

            <mat-card class="accessibility-card" matRipple>
              <mat-card-content class="accessibility-content">
                <div class="accessibility-item">
                  <mat-icon 
                    [class]="data.tour.accessibility.staffTrained ? 'icon-success' : 'icon-unavailable'"
                  >
                    {{ data.tour.accessibility.staffTrained ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                  <div class="accessibility-info">
                    <span class="accessibility-label">Trained Staff</span>
                    <span class="accessibility-status">{{ data.tour.accessibility.staffTrained ? 'Certified' : 'Not Available' }}</span>
                  </div>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="data.tour.accessibility.staffTrained ? 100 : 0"
                  [color]="data.tour.accessibility.staffTrained ? 'primary' : 'warn'"
                  class="accessibility-progress"
                ></mat-progress-bar>
              </mat-card-content>
            </mat-card>

            <mat-card class="accessibility-card" matRipple>
              <mat-card-content class="accessibility-content">
                <div class="accessibility-item">
                  <mat-icon 
                    [class]="data.tour.accessibility.ramps ? 'icon-success' : 'icon-unavailable'"
                  >
                    {{ data.tour.accessibility.ramps ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                  <div class="accessibility-info">
                    <span class="accessibility-label">Wheelchair Access</span>
                    <span class="accessibility-status">{{ data.tour.accessibility.ramps ? 'Accessible' : 'Limited Access' }}</span>
                  </div>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="data.tour.accessibility.ramps ? 100 : 0"
                  [color]="data.tour.accessibility.ramps ? 'primary' : 'warn'"
                  class="accessibility-progress"
                ></mat-progress-bar>
              </mat-card-content>
            </mat-card>

            <mat-card class="accessibility-card" matRipple>
              <mat-card-content class="accessibility-content">
                <div class="accessibility-item">
                  <mat-icon 
                    [class]="data.tour.accessibility.captionsProvided ? 'icon-success' : 'icon-unavailable'"
                  >
                    {{ data.tour.accessibility.captionsProvided ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                  <div class="accessibility-info">
                    <span class="accessibility-label">Captions & Materials</span>
                    <span class="accessibility-status">{{ data.tour.accessibility.captionsProvided ? 'Provided' : 'Not Available' }}</span>
                  </div>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="data.tour.accessibility.captionsProvided ? 100 : 0"
                  [color]="data.tour.accessibility.captionsProvided ? 'primary' : 'warn'"
                  class="accessibility-progress"
                ></mat-progress-bar>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <!-- Tour Details Section -->
        <div class="content-section-wrapper">
          <div class="section-header">
            <mat-icon class="section-icon">info</mat-icon>
            <h3 class="section-title">Important Details</h3>
          </div>
          <div class="details-grid">
            <mat-card class="detail-card" matRipple>
              <mat-card-content class="detail-content">
                <mat-icon class="detail-icon">event_available</mat-icon>
                <div class="detail-info">
                  <span class="detail-label">Next Available</span>
                  <span class="detail-value">{{ getNextAvailableDate() }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="detail-card" matRipple>
              <mat-card-content class="detail-content">
                <mat-icon class="detail-icon">language</mat-icon>
                <div class="detail-info">
                  <span class="detail-label">Languages</span>
                  <span class="detail-value">English, Sign Language</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="detail-card" matRipple>
              <mat-card-content class="detail-content">
                <mat-icon class="detail-icon">fitness_center</mat-icon>
                <div class="detail-info">
                  <span class="detail-label">Difficulty Level</span>
                  <span class="detail-value">{{ getDifficultyLevel() }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="detail-card" matRipple>
              <mat-card-content class="detail-content">
                <mat-icon class="detail-icon">dining</mat-icon>
                <div class="detail-info">
                  <span class="detail-label">Meals Included</span>
                  <span class="detail-value">Breakfast & Lunch</span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="actions-bar">
        <button 
          mat-stroked-button 
          color="primary"
          class="close-action-btn" 
          (click)="onClose()"
        >
          <mat-icon>close</mat-icon>
          Close
        </button>
        <button 
          mat-raised-button 
          color="primary"
          class="book-action-btn" 
          (click)="openBookingDialog()"
        >
          <mat-icon>event</mat-icon>
          Book This Tour
        </button>
      </div>
    </div>
  `,
  styles: [`
    mat-icon {
      font-size: 20px !important;
  }
    
    /* Global Variables */
    :host {
      --primary-color: #2dd4bf;
      --primary-light: #5eead4;
      --primary-dark: #0f766e;
      --accent-color: #f97316;
      --accent-light: #fed7aa;
      --secondary-color: #6366f1;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --error-color: #ef4444;
      --background-color: #ffffff;
      --surface-color: #f8fafc;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      display: block;
    }

    .dialog-container {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    
    /* Hero Section */
    .hero-section {
      position: relative;
      height: 350px;
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
      transform: scale(1.05);
    }
    
    .hero-overlay {
      position: absolute;
      inset: 0;
    }

    .hero-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
    }
    
    .hero-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 32px;
      color: white;
      z-index: 2;
    }

    .hero-badges {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .hero-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .badge-icon {
      font-size: 18px;
    }

    .badge-text {
      white-space: nowrap;
    }
    
    .hero-title {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0 0 12px 0;
      line-height: 1.2;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .hero-subtitle {
      font-size: 1.125rem;
      opacity: 0.95;
      margin: 0;
      line-height: 1.4;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(0, 0, 0, 0.5) !important;
      color: white !important;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
      z-index: 10;
    }
    
    .close-button:hover {
      background: rgba(0, 0, 0, 0.7) !important;
      transform: scale(1.05);
    }
    
    /* Content Section */
    .content-section {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    .info-card {
      margin-bottom: 32px;
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .price-card {
      background: linear-gradient(135deg, #f0fdfa, #ccfbf1) !important;
      border-color: var(--primary-color) !important;
    }

    .price-content {
      padding: 32px !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      flex-wrap: wrap;
    }

    .price-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .price-main {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .currency {
      font-size: 1.25rem;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .amount {
      font-size: 3rem;
      font-weight: 800;
      color: var(--primary-color);
      line-height: 1;
    }

    .price-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .price-divider {
      align-self: stretch;
      margin: 0 16px;
    }

    .capacity-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .capacity-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .capacity-icon {
      color: var(--primary-color);
      font-size: 24px;
    }

    .capacity-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .capacity-details {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .capacity-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .capacity-text {
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .content-section-wrapper {
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .section-icon {
      color: var(--primary-color);
      font-size: 28px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .section-divider {
      margin: 32px 0 !important;
    }

    /* Locations Section */
    .locations-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .location-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .location-chip {
      background-color: rgba(45, 212, 191, 0.1) !important;
      color: var(--primary-color) !important;
      font-size: 0.875rem !important;
      height: 36px !important;
      border-radius: 18px !important;
      border: 1px solid rgba(45, 212, 191, 0.3) !important;
      font-weight: 500 !important;
    }

    /* Description Section */
    .description-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .description-short {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.6;
      margin: 0;
    }

    .description-full {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.8;
      margin: 0;
    }

    /* Features Section */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .feature-card {
      border-radius: 12px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }

    .feature-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
      transform: translateY(-2px);
    }

    .feature-content {
      padding: 16px !important;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .feature-icon {
      color: var(--success-color);
      font-size: 24px;
      flex-shrink: 0;
    }

    .feature-text {
      font-size: 0.95rem;
      color: var(--text-primary);
      line-height: 1.4;
      font-weight: 500;
    }

    /* Accessibility Section */
    .accessibility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .accessibility-card {
      border-radius: 12px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }

    .accessibility-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
      transform: translateY(-2px);
    }

    .accessibility-content {
      padding: 16px !important;
    }

    .accessibility-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .accessibility-item mat-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .icon-success {
      color: var(--success-color);
    }

    .icon-unavailable {
      color: #cbd5e1;
    }

    .accessibility-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .accessibility-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .accessibility-status {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .accessibility-progress {
      height: 4px;
      border-radius: 2px;
    }

    /* Details Section */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .detail-card {
      border-radius: 12px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }

    .detail-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
      transform: translateY(-2px);
    }

    .detail-content {
      padding: 20px !important;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .detail-icon {
      color: var(--primary-color);
      font-size: 32px;
      flex-shrink: 0;
    }

    .detail-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Actions Bar */
    .actions-bar {
      padding: 24px 32px;
      background: linear-gradient(135deg, var(--surface-color), white);
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 16px;
      flex-shrink: 0;
    }

    .close-action-btn {
      flex: 1;
      padding: 12px 24px !important;
      height: auto !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      transition: all 0.2s ease !important;
    }

    .close-action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .book-action-btn {
      flex: 2;
      padding: 12px 24px !important;
      height: auto !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      background-color: var(--primary-color) !important;
      transition: all 0.2s ease !important;
    }

    .book-action-btn:hover {
      background-color: var(--primary-dark) !important;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(45, 212, 191, 0.3);
    }

    /* Material Design Overrides */
    ::ng-deep .mat-mdc-chip-listbox .mat-mdc-chip {
      border-radius: 18px;
    }

    ::ng-deep .mat-mdc-progress-bar {
      border-radius: 2px;
    }

    /* Scrollbar Styling */
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

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-section {
        height: 280px;
      }

      .hero-content {
        padding: 24px;
      }

      .hero-title {
        font-size: 1.75rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .content-section {
        padding: 24px;
      }

      .price-content {
        flex-direction: column;
        text-align: center;
      }

      .price-divider {
        width: 100%;
        margin: 16px 0;
      }

      .accessibility-grid {
        grid-template-columns: 1fr;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .actions-bar {
        flex-direction: column;
        padding: 20px 24px;
      }
    }

    @media (max-width: 480px) {
      .dialog-container {
        margin: 8px;
        max-height: calc(100vh - 16px);
        border-radius: 16px;
      }

      .hero-section {
        height: 240px;
      }

      .hero-content {
        padding: 20px;
      }

      .hero-title {
        font-size: 1.5rem;
      }

      .content-section {
        padding: 16px;
      }

      .actions-bar {
        padding: 16px;
      }
    }
  `]
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
      adventure: 'hiking',
      group: 'groups',
      private: 'person',
      deaf_guide: 'accessibility'
    };
    return icons[type as keyof typeof icons] || 'tour';
  }

  getNextAvailableDate(): string {
    if (this.data.tour.nextAvailableDates && this.data.tour.nextAvailableDates.length > 0) {
      const date = this.data.tour.nextAvailableDates[0];
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return 'Contact us for availability';
  }

  getDifficultyLevel(): string {
    // You can add difficulty level to Tour model or derive it from tour type
    const difficultyMap: { [key: string]: string } = {
      adventure: 'Moderate to Challenging',
      group: 'Easy to Moderate',
      private: 'Customizable',
      deaf_guide: 'Easy to Moderate'
    };
    return difficultyMap[this.data.tour.type] || 'Moderate';
  }

  trackByLocation(index: number, location: string): string {
    return location;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }
}