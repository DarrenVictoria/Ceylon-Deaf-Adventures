import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { Timestamp } from '@angular/fire/firestore';
import { BookingsService } from '../../services/bookings.service';
import { Tour } from '../../models/tour';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatRippleModule
  ],
  template: `
    <div class="booking-container">
      <!-- Header Section -->
      <div class="booking-header">
        <div class="header-background"></div>
        <div class="header-content">
          <div class="header-icon">
            <mat-icon class="header-main-icon">event_available</mat-icon>
          </div>
          <div class="header-text">
            <h2 class="booking-title">Book Your Adventure</h2>
            <p class="tour-name">{{ data.tour.title }}</p>
            <div class="tour-details">
              <div class="detail-item">
                <mat-icon class="detail-icon">schedule</mat-icon>
                <span>{{ data.tour.durationDays }} {{ data.tour.durationDays === 1 ? 'Day' : 'Days' }}</span>
              </div>
              <div class="detail-item">
                <mat-icon class="detail-icon">category</mat-icon>
                <span>{{ data.tour.type | titlecase }}</span>
              </div>
            </div>
          </div>
        </div>
        <button mat-icon-button class="close-button" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <!-- Content Section -->
      <div class="booking-content">
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <!-- Personal Information Section -->
          <mat-card class="form-section-card">
            <mat-card-header class="section-header">
              <div mat-card-avatar class="section-avatar personal-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <mat-card-title class="section-title">Personal Information</mat-card-title>
              <mat-card-subtitle class="section-subtitle">Tell us about yourself</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="section-content">
              <div class="form-grid">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Full Name *</mat-label>
                  <input 
                    matInput 
                    formControlName="guestName" 
                    placeholder="Enter your full name"
                    autocomplete="name"
                  >
                  <mat-icon matSuffix>account_circle</mat-icon>
                  <mat-error *ngIf="bookingForm.get('guestName')?.hasError('required')">
                    Name is required
                  </mat-error>
                  <mat-error *ngIf="bookingForm.get('guestName')?.hasError('minlength')">
                    Name must be at least 2 characters
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Email Address *</mat-label>
                  <input 
                    matInput 
                    type="email" 
                    formControlName="guestEmail" 
                    placeholder="your@email.com"
                    autocomplete="email"
                  >
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="bookingForm.get('guestEmail')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="bookingForm.get('guestEmail')?.hasError('email')">
                    Please enter a valid email address
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Phone Number</mat-label>
                  <input 
                    matInput 
                    formControlName="guestPhone" 
                    placeholder="+94 XX XXX XXXX"
                    autocomplete="tel"
                  >
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-hint>Optional but recommended for tour updates</mat-hint>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Tour Details Section -->
          <mat-card class="form-section-card">
            <mat-card-header class="section-header">
              <div mat-card-avatar class="section-avatar tour-avatar">
                <mat-icon>explore</mat-icon>
              </div>
              <mat-card-title class="section-title">Tour Details</mat-card-title>
              <mat-card-subtitle class="section-subtitle">When would you like to explore?</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="section-content">
              <div class="form-grid">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Preferred Tour Date *</mat-label>
                  <input 
                    matInput 
                    [matDatepicker]="picker" 
                    formControlName="tourDate" 
                    [min]="minDate"
                    readonly
                  >
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="bookingForm.get('tourDate')?.hasError('required')">
                    Please select a tour date
                  </mat-error>
                  <mat-hint>Select your preferred starting date</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Number of People *</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="numPeople" 
                    [min]="1" 
                    [max]="data.tour.capacity"
                    placeholder="1"
                  >
                  <mat-icon matSuffix>groups</mat-icon>
                  <mat-error *ngIf="bookingForm.get('numPeople')?.hasError('required')">
                    Number of people is required
                  </mat-error>
                  <mat-error *ngIf="bookingForm.get('numPeople')?.hasError('min')">
                    At least 1 person is required
                  </mat-error>
                  <mat-error *ngIf="bookingForm.get('numPeople')?.hasError('max')">
                    Maximum {{ data.tour.capacity }} people allowed
                  </mat-error>
                  <mat-hint>Maximum {{ data.tour.capacity }} people per booking</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Preferred Stay Type *</mat-label>
                  <mat-select formControlName="stayType">
                    <mat-option value="Homestay">
                      <div class="select-option">
                        <mat-icon>home</mat-icon>
                        <span>Homestay</span>
                      </div>
                    </mat-option>
                    <mat-option value="Guesthouse">
                      <div class="select-option">
                        <mat-icon>apartment</mat-icon>
                        <span>Guesthouse</span>
                      </div>
                    </mat-option>
                    <mat-option value="Villa">
                      <div class="select-option">
                        <mat-icon>villa</mat-icon>
                        <span>Villa</span>
                      </div>
                    </mat-option>
                    <mat-option value="Hotel3to5">
                      <div class="select-option">
                        <mat-icon>hotel</mat-icon>
                        <span>Hotel 3-5 Stars</span>
                      </div>
                    </mat-option>
                    <mat-option value="Camping">
                      <div class="select-option">
                        <mat-icon>nature</mat-icon>
                        <span>Camping</span>
                      </div>
                    </mat-option>
                  </mat-select>
                  <mat-hint>Choose your preferred accommodation type</mat-hint>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Pricing Section -->
          <mat-card class="form-section-card pricing-card">
            <mat-card-header class="section-header">
              <div mat-card-avatar class="section-avatar pricing-avatar">
                <mat-icon>payments</mat-icon>
              </div>
              <mat-card-title class="section-title">Pricing</mat-card-title>
              <mat-card-subtitle class="section-subtitle">Tour cost and your offer</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="section-content">
              <div class="price-display-card">
                <div class="price-info">
                  <div class="suggested-price">
                    <span class="price-label">Suggested Price</span>
                    <div class="price-amount">
                      <span class="currency">{{ data.tour.currency }}</span>
                      <span class="amount">{{ data.tour.priceDisplay }}</span>
                    </div>
                    <span class="price-per">per person</span>
                  </div>
                  <div class="total-calculation" *ngIf="bookingForm.get('numPeople')?.value > 0">
                    <mat-divider class="calc-divider"></mat-divider>
                    <div class="calc-row">
                      <span class="calc-label">{{ bookingForm.get('numPeople')?.value }} people × {{ data.tour.currency }} {{ data.tour.priceDisplay }}</span>
                      <span class="calc-total">{{ data.tour.currency }} {{ calculateSuggestedTotal() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <mat-form-field appearance="outline" class="form-field-full">
                <mat-label>Your Bid Price ({{ data.tour.currency }}) *</mat-label>
                <input 
                  matInput 
                  type="number" 
                  formControlName="totalPrice" 
                  [min]="0" 
                  step="0.01"
                  placeholder="Enter your offer"
                >
                <span matTextPrefix>{{ data.tour.currency }}&nbsp;</span>
                <mat-icon matSuffix>local_offer</mat-icon>
                <mat-hint>You can negotiate the price. We'll review your offer within 24 hours.</mat-hint>
                <mat-error *ngIf="bookingForm.get('totalPrice')?.hasError('required')">
                  Please enter your bid price
                </mat-error>
                <mat-error *ngIf="bookingForm.get('totalPrice')?.hasError('min')">
                  Price cannot be negative
                </mat-error>
              </mat-form-field>
            </mat-card-content>
          </mat-card>

          <!-- Accessibility Section -->
          <mat-card class="form-section-card accessibility-card">
            <mat-card-header class="section-header">
              <div mat-card-avatar class="section-avatar accessibility-avatar">
                <mat-icon>accessible</mat-icon>
              </div>
              <mat-card-title class="section-title">Accessibility Options</mat-card-title>
              <mat-card-subtitle class="section-subtitle">Customize your accessible experience</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="section-content">
              <div class="checkbox-container">
                <mat-checkbox formControlName="guideRequired" class="guide-checkbox">
                  <div class="checkbox-content">
                    <div class="checkbox-title">
                      <mat-icon class="checkbox-icon">sign_language</mat-icon>
                      Require Deaf Guide with Sign Language Support
                    </div>
                    <div class="checkbox-description">
                      Our certified deaf guides provide full sign language interpretation throughout your tour,
                      ensuring you don't miss any cultural insights or important information.
                    </div>
                  </div>
                </mat-checkbox>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Special Requests Section -->
          <mat-card class="form-section-card">
            <mat-card-header class="section-header">
              <div mat-card-avatar class="section-avatar requests-avatar">
                <mat-icon>message</mat-icon>
              </div>
              <mat-card-title class="section-title">Additional Information</mat-card-title>
              <mat-card-subtitle class="section-subtitle">Let us know your special needs</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="section-content">
              <mat-form-field appearance="outline" class="form-field-full">
                <mat-label>Special Requests or Dietary Requirements</mat-label>
                <textarea 
                  matInput 
                  formControlName="specialRequests" 
                  rows="4" 
                  placeholder="Please share any dietary restrictions, accessibility needs, medical conditions, or special requests that would help us customize your experience..."
                  maxlength="500"
                ></textarea>
                <mat-hint align="end">{{ getCharacterCount() }}/500</mat-hint>
              </mat-form-field>
            </mat-card-content>
          </mat-card>

          <!-- Error Display -->
          <mat-card *ngIf="errorMessage" class="error-card">
            <mat-card-content class="error-content">
              <mat-icon class="error-icon">error</mat-icon>
              <div class="error-text">
                <h4 class="error-title">Booking Error</h4>
                <p class="error-message">{{ errorMessage }}</p>
              </div>
            </mat-card-content>
          </mat-card>
        </form>

        <!-- Terms and Conditions -->
        <mat-card class="terms-card">
          <mat-card-content class="terms-content">
            <div class="terms-icon">
              <mat-icon>info</mat-icon>
            </div>
            <div class="terms-text">
              <p class="terms-description">
                By submitting this booking request, you agree to our 
                <a href="#" class="terms-link">terms and conditions</a> and 
                <a href="#" class="terms-link">cancellation policy</a>.
                We'll contact you within 24 hours to confirm your booking.
              </p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Actions Section -->
      <div class="actions-container">
        <button 
          mat-stroked-button
          color="primary"
          class="cancel-btn" 
          (click)="onCancel()" 
          [disabled]="isSubmitting"
        >
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button 
          mat-raised-button
          color="primary"
          class="submit-btn" 
          (click)="onSubmit()" 
          [disabled]="!bookingForm.valid || isSubmitting"
        >
          <mat-spinner *ngIf="isSubmitting" diameter="20" class="submit-spinner"></mat-spinner>
          <mat-icon *ngIf="!isSubmitting">send</mat-icon>
          {{ isSubmitting ? 'Processing Request...' : 'Submit Booking Request' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Global Variables - Improved Contrast */
    :host {
      --primary-color: #0d9488;
      --primary-light: #14b8a6;
      --primary-dark: #0f766e;
      --accent-color: #ea580c;
      --accent-light: #fb923c;
      --secondary-color: #4f46e5;
      --success-color: #059669;
      --warning-color: #d97706;
      --error-color: #dc2626;
      --background-color: #ffffff;
      --surface-color: #f9fafb;
      --surface-raised: #ffffff;
      --text-primary: #111827;
      --text-secondary: #4b5563;
      --text-muted: #6b7280;
      --border-color: #e5e7eb;
      --border-color-light: #f3f4f6;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-xl: 18px;
      --radius-2xl: 22px;
      --spacing-xs: 8px;
      --spacing-sm: 12px;
      --spacing-md: 16px;
      --spacing-lg: 20px;
      --spacing-xl: 24px;
      --spacing-2xl: 32px;
      --spacing-3xl: 40px;
      display: block;
    }

    .booking-container {
      background: var(--background-color);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl), 0 0 0 1px rgba(0, 0, 0, 0.05);
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    
    /* Header Section - Improved Contrast */
    .booking-header {
      position: relative;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: white;
      padding: var(--spacing-2xl) var(--spacing-2xl) var(--spacing-xl);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
    }

    .header-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/api/placeholder/800/200') center/cover;
      opacity: 0.08;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      flex: 1;
      position: relative;
      z-index: 2;
    }
    
    .header-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: var(--spacing-md);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;
    }

    .header-main-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    .header-text {
      flex: 1;
      min-width: 0;
    }
    
    .booking-title {
      font-size: 1.625rem;
      font-weight: 700;
      margin: 0 0 var(--spacing-xs) 0;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }
    
    .tour-name {
      font-size: 1rem;
      opacity: 0.95;
      margin: 0 0 var(--spacing-sm) 0;
      font-weight: 500;
      line-height: 1.3;
    }
    
    .tour-details {
      display: flex;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.8125rem;
      opacity: 0.95;
      font-weight: 500;
    }

    .detail-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .close-button {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      border-radius: 50%;
      backdrop-filter: blur(12px);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      width: 44px;
      height: 44px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 2;
      flex-shrink: 0;
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    /* Content Section - Better Spacing */
    .booking-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
      background: var(--surface-color);
    }
    
    .form-section-card {
      border-radius: var(--radius-lg) !important;
      box-shadow: var(--shadow-sm) !important;
      border: 1px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--surface-raised) !important;
    }

    .form-section-card:hover {
      box-shadow: var(--shadow-md) !important;
      border-color: var(--primary-color);
    }

    .section-header {
      padding: var(--spacing-lg) var(--spacing-lg) 0 !important;
      margin-bottom: var(--spacing-md) !important;
    }

    .section-avatar {
      width: 44px !important;
      height: 44px !important;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .section-avatar mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .personal-avatar {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      color: white;
    }

    .tour-avatar {
      background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
      color: white;
    }

    .pricing-avatar {
      background: linear-gradient(135deg, var(--success-color), #34d399);
      color: white;
    }

    .accessibility-avatar {
      background: linear-gradient(135deg, var(--secondary-color), #818cf8);
      color: white;
    }

    .requests-avatar {
      background: linear-gradient(135deg, var(--warning-color), #fbbf24);
      color: white;
    }

    .section-title {
      font-size: 1.125rem !important;
      font-weight: 700 !important;
      color: var(--text-primary) !important;
      margin-bottom: 2px !important;
      letter-spacing: -0.01em;
    }

    .section-subtitle {
      font-size: 0.8125rem !important;
      color: var(--text-secondary) !important;
      font-weight: 500;
    }

    .section-content {
      padding: 0 var(--spacing-lg) var(--spacing-lg) !important;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
    }
    
    .form-field,
    .form-field-full {
      width: 100%;
    }
    
    .form-field-full {
      grid-column: 1 / -1;
    }
    
    .select-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    /* Pricing Section - Enhanced Contrast */
    .pricing-card {
      background: var(--surface-raised) !important;
    }

    .price-display-card {
      background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
      border: 2px solid var(--primary-color);
      border-radius: var(--radius-md);
      padding: var(--spacing-xl);
      margin-bottom: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
    }

    .price-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .suggested-price {
      text-align: center;
    }

    .price-label {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      font-weight: 600;
      margin-bottom: var(--spacing-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .price-amount {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 4px;
      margin: var(--spacing-xs) 0;
    }

    .currency {
      font-size: 1.125rem;
      color: var(--text-secondary);
      font-weight: 700;
    }

    .amount {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--primary-dark);
      line-height: 1;
      letter-spacing: -0.02em;
    }

    .price-per {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: center;
      font-weight: 500;
    }

    .calc-divider {
      margin: var(--spacing-md) 0;
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xs) 0;
    }

    .calc-label {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .calc-total {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    /* Accessibility Section - Better Contrast */
    .accessibility-card {
      background: var(--surface-raised) !important;
    }

    .checkbox-container {
      background: linear-gradient(135deg, #faf5ff, #f3e8ff);
      border: 2px solid var(--secondary-color);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
    }

    .guide-checkbox {
      width: 100%;
    }

    .checkbox-content {
      margin-left: var(--spacing-sm);
    }

    .checkbox-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
      font-size: 0.9375rem;
    }

    .checkbox-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--secondary-color);
    }

    .checkbox-description {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      line-height: 1.5;
      font-weight: 500;
    }

    /* Error Section - Improved Contrast */
    .error-card {
      background: linear-gradient(135deg, #fef2f2, #fee2e2) !important;
      border: 2px solid #f87171 !important;
      border-radius: var(--radius-md) !important;
      box-shadow: var(--shadow-sm) !important;
    }

    .error-content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      padding: var(--spacing-lg) !important;
    }

    .error-icon {
      color: var(--error-color);
      font-size: 24px;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .error-text {
      flex: 1;
    }

    .error-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--error-color);
      margin: 0 0 var(--spacing-xs) 0;
      letter-spacing: -0.01em;
    }

    .error-message {
      font-size: 0.8125rem;
      color: #991b1b;
      line-height: 1.5;
      margin: 0;
      font-weight: 500;
    }

    /* Terms Section - Better Readability */
    .terms-card {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
      border: 1px solid #7dd3fc !important;
      border-radius: var(--radius-md) !important;
      box-shadow: var(--shadow-sm) !important;
    }

    .terms-content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg) !important;
    }

    .terms-icon {
      color: #0369a1;
      flex-shrink: 0;
    }

    .terms-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .terms-text {
      flex: 1;
    }

    .terms-description {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      font-weight: 500;
    }

    .terms-link {
      color: var(--primary-dark);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-bottom: 1px solid transparent;
    }

    .terms-link:hover {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .terms-link:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
      border-radius: 2px;
    }

    /* Actions Section - Refined Spacing */
    .actions-container {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-lg) var(--spacing-2xl);
      background: var(--surface-raised);
      border-top: 1px solid var(--border-color);
      flex-shrink: 0;
      box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
    }

    .cancel-btn {
      flex: 1;
      padding: var(--spacing-sm) var(--spacing-xl) !important;
      height: 48px !important;
      border-radius: var(--radius-md) !important;
      font-weight: 600 !important;
      font-size: 0.9375rem !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      border: 2px solid var(--primary-color) !important;
      letter-spacing: -0.01em;
    }

    .cancel-btn mat-icon {
      margin-right: var(--spacing-xs);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .cancel-btn:hover:not([disabled]) {
      background: var(--surface-color) !important;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .cancel-btn:focus {
      outline: 3px solid rgba(13, 148, 136, 0.3);
      outline-offset: 2px;
    }

    .submit-btn {
      flex: 2;
      padding: var(--spacing-sm) var(--spacing-xl) !important;
      height: 48px !important;
      border-radius: var(--radius-md) !important;
      font-weight: 600 !important;
      font-size: 0.9375rem !important;
      background-color: var(--primary-color) !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      box-shadow: var(--shadow-sm);
      letter-spacing: -0.01em;
    }

    .submit-btn mat-icon {
      margin-right: var(--spacing-xs);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .submit-btn:hover:not([disabled]) {
      background-color: var(--primary-dark) !important;
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg), 0 0 0 3px rgba(13, 148, 136, 0.15);
    }

    .submit-btn:focus {
      outline: 3px solid rgba(13, 148, 136, 0.4);
      outline-offset: 2px;
    }

    .submit-btn:disabled {
      background-color: #d1d5db !important;
      color: #6b7280 !important;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      opacity: 0.6;
    }

    .submit-spinner {
      margin-right: var(--spacing-xs);
    }

    .submit-spinner ::ng-deep circle {
      stroke: white;
    }

    /* Material Design Overrides - Better Borders */
    ::ng-deep .mat-mdc-form-field {
      margin-bottom: 4px;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      border-radius: var(--radius-md);
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-thick {
      border-color: var(--primary-color);
      border-width: 2px;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline.mat-focused .mat-mdc-form-field-outline-thick {
      border-color: var(--primary-dark);
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-start,
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-end {
      border-radius: var(--radius-md);
    }

    ::ng-deep .mat-mdc-form-field-hint,
    ::ng-deep .mat-mdc-form-field-error {
      font-size: 0.75rem;
      font-weight: 500;
      margin-top: 4px;
    }

    ::ng-deep .mat-mdc-form-field-error {
      color: var(--error-color);
    }

    ::ng-deep .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
    }

    ::ng-deep .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:focus:checked ~ .mdc-checkbox__background {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
    }

    ::ng-deep .mat-mdc-option .mat-icon {
      margin-right: var(--spacing-sm);
      color: var(--text-secondary);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    ::ng-deep .mat-mdc-option.mat-mdc-option-active,
    ::ng-deep .mat-mdc-option:hover {
      background: var(--surface-color);
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      margin-top: 4px;
    }

    ::ng-deep .mat-datepicker-toggle {
      color: var(--text-secondary);
    }

    ::ng-deep .mat-mdc-icon-button.mat-datepicker-toggle {
      width: 40px;
      height: 40px;
      padding: 8px;
    }

    /* Scrollbar Styling - More Refined */
    .booking-content::-webkit-scrollbar {
      width: 8px;
    }

    .booking-content::-webkit-scrollbar-track {
      background: var(--border-color-light);
      border-radius: 4px;
      margin: 4px 0;
    }

    .booking-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
      border: 2px solid var(--border-color-light);
    }

    .booking-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Focus Visible - Accessibility */
    button:focus-visible,
    input:focus-visible,
    textarea:focus-visible,
    select:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* Responsive Design - Better Breakpoints */
    @media (max-width: 768px) {
      :host {
        --spacing-xs: 6px;
        --spacing-sm: 10px;
        --spacing-md: 14px;
        --spacing-lg: 18px;
        --spacing-xl: 22px;
        --spacing-2xl: 28px;
      }

      .booking-header {
        padding: var(--spacing-xl) var(--spacing-lg);
      }

      .header-content {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-md);
      }

      .booking-title {
        font-size: 1.375rem;
      }

      .tour-name {
        font-size: 0.9375rem;
      }

      .booking-content {
        padding: var(--spacing-xl);
        gap: var(--spacing-lg);
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .section-content {
        padding: 0 var(--spacing-md) var(--spacing-md) !important;
      }

      .actions-container {
        flex-direction: column;
        padding: var(--spacing-lg);
        gap: var(--spacing-sm);
      }

      .cancel-btn,
      .submit-btn {
        flex: 1;
      }

      .tour-details {
        justify-content: center;
      }

      .price-display-card {
        padding: var(--spacing-lg);
      }

      .amount {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      .booking-container {
        margin: 8px;
        max-height: calc(100vh - 16px);
        border-radius: var(--radius-xl);
      }

      .booking-header {
        padding: var(--spacing-lg);
      }

      .header-icon {
        padding: var(--spacing-sm);
      }

      .header-main-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .close-button {
        width: 40px;
        height: 40px;
      }

      .booking-content {
        padding: var(--spacing-lg);
        gap: var(--spacing-md);
      }

      .form-section-card {
        border-radius: var(--radius-md) !important;
      }

      .section-header {
        padding: var(--spacing-md) var(--spacing-md) 0 !important;
      }

      .section-avatar {
        width: 40px !important;
        height: 40px !important;
      }

      .section-avatar mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .actions-container {
        padding: var(--spacing-md);
      }

      .cancel-btn,
      .submit-btn {
        height: 44px !important;
        font-size: 0.875rem !important;
      }

      .booking-title {
        font-size: 1.25rem;
      }

      .tour-name {
        font-size: 0.875rem;
      }

      .detail-item {
        font-size: 0.75rem;
      }

      .section-title {
        font-size: 1rem !important;
      }

      .amount {
        font-size: 1.75rem;
      }
    }

    /* Print Styles */
    @media print {
      .booking-header,
      .actions-container,
      .close-button {
        display: none;
      }

      .booking-container {
        box-shadow: none;
        max-height: none;
      }

      .booking-content {
        overflow: visible;
        padding: 0;
      }
    }
  `]
})
export class BookingDialogComponent implements OnInit {
  bookingForm!: FormGroup;
  minDate = new Date();
  isSubmitting = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tour: Tour },
    private fb: FormBuilder,
    private bookingsService: BookingsService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  private initializeForm() {
    this.bookingForm = this.fb.group({
      guestName: ['', [Validators.required, Validators.minLength(2)]],
      guestEmail: ['', [Validators.required, Validators.email]],
      guestPhone: [''],
      tourDate: [null, Validators.required],
      numPeople: [1, [Validators.required, Validators.min(1), Validators.max(this.data.tour.capacity)]],
      totalPrice: [this.data.tour.priceDisplay, [Validators.required, Validators.min(0)]],
      stayType: ['Homestay', Validators.required],
      specialRequests: [''],
      guideRequired: [true]
    });
  }

  private setupFormSubscriptions() {
    this.bookingForm.get('numPeople')?.valueChanges.subscribe(numPeople => {
      if (numPeople && numPeople > 0) {
        const suggestedTotal = this.data.tour.priceDisplay * numPeople;
        this.bookingForm.get('totalPrice')?.setValue(suggestedTotal);
        this.cdr.markForCheck();
      }
    });

    this.bookingForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
        this.cdr.markForCheck();
      }
    });
  }

  calculateSuggestedTotal(): number {
    const numPeople = this.bookingForm.get('numPeople')?.value || 1;
    return this.data.tour.priceDisplay * numPeople;
  }

  getCharacterCount(): number {
    const specialRequests = this.bookingForm.get('specialRequests')?.value || '';
    return specialRequests.length;
  }

  async onSubmit() {
    if (this.bookingForm.invalid) {
      this.markFormGroupTouched();
      this.scrollToFirstError();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      const formValue = this.bookingForm.value;
      const booking: Partial<Booking> = {
        ...formValue,
        tourId: this.data.tour.id,
        tourDate: Timestamp.fromDate(formValue.tourDate),
        status: 'pending' as const,
        numDays: this.data.tour.durationDays
      };

      const bookingId = await this.bookingsService.requestBooking(booking);

      this.snackBar.open(
        'Booking request submitted successfully! We will contact you within 24 hours to confirm your tour.',
        'Close',
        {
          duration: 6000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        }
      );

      this.dialogRef.close({ success: true, bookingId });

    } catch (error: any) {
      console.error('Booking error:', error);
      this.errorMessage = this.getErrorMessage(error);
      this.cdr.markForCheck();
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  onCancel() {
    if (this.bookingForm.dirty && !this.isSubmitting) {
      const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    this.dialogRef.close({ success: false });
  }

  private markFormGroupTouched() {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      control?.markAsTouched();
      if (control?.invalid) {
        control?.markAsDirty();
      }
    });
  }

  private scrollToFirstError() {
    setTimeout(() => {
      const firstError = document.querySelector('.mat-mdc-form-field-error');
      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }

  private getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;

    if (error?.code) {
      switch (error.code) {
        case 'permission-denied':
          return 'You do not have permission to make bookings. Please try again later.';
        case 'unavailable':
          return 'Our booking service is temporarily unavailable. Please try again in a few minutes.';
        case 'deadline-exceeded':
          return 'The request timed out. Please check your internet connection and try again.';
        case 'invalid-argument':
          return 'Some of the information provided is invalid. Please check your details and try again.';
        case 'resource-exhausted':
          return 'Too many booking requests at the moment. Please wait a few minutes and try again.';
        case 'failed-precondition':
          return 'This tour may no longer be available for the selected date. Please try a different date.';
        default:
          return `Booking failed (${error.code}). Please try again or contact support if the problem persists.`;
      }
    }

    return 'An unexpected error occurred while submitting your booking. Please try again or contact support if the problem continues.';
  }
}