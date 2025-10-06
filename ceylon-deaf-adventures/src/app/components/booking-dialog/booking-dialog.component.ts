import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
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
    MatRippleModule,
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
                  <mat-label>Full Name</mat-label>
                  <input 
                    matInput 
                    formControlName="guestName" 
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
                  <mat-label>Email Address</mat-label>
                  <input 
                    matInput 
                    type="email" 
                    formControlName="guestEmail" 
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
                <mat-form-field appearance="outline" class="form-field" >
                  <mat-label>Preferred Tour Date</mat-label>
                  <input 
                    matInput 
                    [matDatepicker]="picker" 
                    formControlName="tourDate" 
                    [min]="minDate"
                    (click)="openDatePicker()"
                    
                  >
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="bookingForm.get('tourDate')?.hasError('required')">
                    Please select a tour date
                  </mat-error>
                  <mat-hint>Select your preferred starting date</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Number of People</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="numPeople" 
                    [min]="1" 
                    [max]="data.tour.capacity"
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
                  <mat-label>Preferred Stay Type</mat-label>
                  <mat-select formControlName="stayType">
                    <mat-option value="Homestay">Homestay</mat-option>
                    <mat-option value="Guesthouse">Guesthouse</mat-option>
                    <mat-option value="Villa">Villa</mat-option>
                    <mat-option value="Hotel3to5">Hotel 3-5 Stars</mat-option>
                    <mat-option value="Camping">Camping</mat-option>
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
                <mat-label>Your Bid Price ({{ data.tour.currency }})</mat-label>
                <input 
                  matInput 
                  type="number" 
                  formControlName="totalPrice" 
                  [min]="0" 
                  step="0.01"
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
    /* Azure Blue Theme Variables */
    :host {
      --azure-primary: #0078D4;
      --azure-primary-dark: #005A9E;
      --azure-primary-light: #50A0E8;
      --azure-secondary: #0063B1;
      --azure-accent: #00BCF2;
      --azure-success: #107C10;
      --azure-warning: #F7630C;
      --azure-error: #D13438;
      --azure-bg: #FFFFFF;
      --azure-surface: #F3F2F1;
      --azure-surface-raised: #FFFFFF;
      --azure-text-primary: #201F1E;
      --azure-text-secondary: #605E5C;
      --azure-text-muted: #8A8886;
      --azure-border: #EDEBE9;
      --azure-border-light: #F3F2F1;
      --shadow-sm: 0 1.6px 3.6px rgba(0, 0, 0, 0.1), 0 0.3px 0.9px rgba(0, 0, 0, 0.07);
      --shadow-md: 0 6.4px 14.4px rgba(0, 0, 0, 0.13), 0 1.2px 3.6px rgba(0, 0, 0, 0.11);
      --shadow-lg: 0 25.6px 57.6px rgba(0, 0, 0, 0.22), 0 4.8px 14.4px rgba(0, 0, 0, 0.18);
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --spacing-xs: 8px;
      --spacing-sm: 12px;
      --spacing-md: 16px;
      --spacing-lg: 20px;
      --spacing-xl: 24px;
      --spacing-2xl: 32px;
      display: block;
    }

    ::ng-deep .mat-datepicker-content {
      z-index: 10000 !important; /* Ensure the datepicker appears above other elements */
    }

    ::ng-deep .mat-datepicker-toggle {
      pointer-events: auto !important; /* Ensure toggle is clickable */
    }

    .booking-container {
      background: var(--azure-bg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-lg);
    }
    
    /* Header - Azure Blue Gradient */
    .booking-header {
      position: relative;
      background: linear-gradient(135deg, var(--azure-primary) 0%, var(--azure-secondary) 100%);
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
      color: white;
    }
    
    .header-text {
      flex: 1;
      min-width: 0;
    }
    
    .booking-title {
      font-size: 1.625rem;
      font-weight: 600;
      margin: 0 0 var(--spacing-xs) 0;
      line-height: 1.2;
      color: white;
    }
    
    .tour-name {
      font-size: 1rem;
      opacity: 0.95;
      margin: 0 0 var(--spacing-sm) 0;
      font-weight: 500;
      line-height: 1.3;
      color: white;
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
      font-size: 0.875rem;
      opacity: 0.95;
      font-weight: 500;
      color: white;
    }

    .detail-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: white;
    }
    
    .close-button {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      border-radius: 50%;
      backdrop-filter: blur(12px);
      transition: all 0.2s ease;
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
    }
    
    /* Content Section */
    .booking-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      background: var(--azure-surface);
    }
    
    .form-section-card {
      border-radius: var(--radius-md) !important;
      box-shadow: var(--shadow-sm) !important;
      border: 1px solid var(--azure-border);
      transition: all 0.2s ease;
      background: var(--azure-surface-raised) !important;
    }

    .form-section-card:hover {
      box-shadow: var(--shadow-md) !important;
    }

    .section-header {
      padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-sm) !important;
      margin-bottom: 0 !important;
    }

    .section-avatar {
      width: 48px !important;
      height: 48px !important;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .section-avatar mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: white;
    }

    .personal-avatar {
      background: var(--azure-primary);
    }

    .tour-avatar {
      background: var(--azure-accent);
    }

    .pricing-avatar {
      background: var(--azure-success);
    }

    .accessibility-avatar {
      background: var(--azure-secondary);
    }

    .requests-avatar {
      background: var(--azure-warning);
    }

    .section-title {
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      color: var(--azure-text-primary) !important;
      margin-bottom: 4px !important;
    }

    .section-subtitle {
      font-size: 0.875rem !important;
      color: var(--azure-text-secondary) !important;
      font-weight: 400;
    }

    .section-content {
      padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg) !important;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-md);
    }
    
    .form-field,
    .form-field-full {
      width: 100%;
    }
    
    .form-field-full {
      grid-column: 1 / -1;
    }

    /* Pricing Section */
    .price-display-card {
      background: linear-gradient(135deg, #E1F5FE, #B3E5FC);
      border: 2px solid var(--azure-primary);
      border-radius: var(--radius-md);
      padding: var(--spacing-xl);
      margin-bottom: var(--spacing-lg);
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
      font-size: 0.875rem;
      color: var(--azure-text-secondary);
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
      color: var(--azure-text-secondary);
      font-weight: 600;
    }

    .amount {
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--azure-primary-dark);
      line-height: 1;
    }

    .price-per {
      font-size: 0.8125rem;
      color: var(--azure-text-secondary);
      font-weight: 400;
    }

    .calc-divider {
      margin: var(--spacing-md) 0;
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .calc-label {
      font-size: 0.875rem;
      color: var(--azure-text-secondary);
      font-weight: 500;
    }

    .calc-total {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--azure-text-primary);
    }

    /* Accessibility Section */
    .checkbox-container {
      background: linear-gradient(135deg, #F3E5F5, #E1BEE7);
      border: 2px solid var(--azure-secondary);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
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
      color: var(--azure-text-primary);
      margin-bottom: var(--spacing-xs);
      font-size: 1rem;
    }

    .checkbox-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--azure-secondary);
    }

    .checkbox-description {
      font-size: 0.875rem;
      color: var(--azure-text-secondary);
      line-height: 1.5;
    }

    /* Error Card */
    .error-card {
      background: linear-gradient(135deg, #FFEBEE, #FFCDD2) !important;
      border: 2px solid var(--azure-error) !important;
      border-radius: var(--radius-md) !important;
    }

    .error-content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      padding: var(--spacing-lg) !important;
    }

    .error-icon {
      color: var(--azure-error);
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .error-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--azure-error);
      margin: 0 0 var(--spacing-xs) 0;
    }

    .error-message {
      font-size: 0.875rem;
      color: #B71C1C;
      line-height: 1.5;
      margin: 0;
    }

    /* Terms Card */
    .terms-card {
      background: linear-gradient(135deg, #E3F2FD, #BBDEFB) !important;
      border: 1px solid #64B5F6 !important;
      border-radius: var(--radius-md) !important;
    }

    .terms-content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg) !important;
    }

    .terms-icon {
      color: var(--azure-primary);
    }

    .terms-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .terms-description {
      font-size: 0.875rem;
      color: var(--azure-text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .terms-link {
      color: var(--azure-primary);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
      border-bottom: 1px solid transparent;
    }

    .terms-link:hover {
      color: var(--azure-primary-dark);
      border-bottom-color: var(--azure-primary-dark);
    }

    /* Action Buttons */
    .actions-container {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-lg) var(--spacing-2xl);
      background: var(--azure-surface-raised);
      border-top: 1px solid var(--azure-border);
      flex-shrink: 0;
    }

    .cancel-btn {
      flex: 1;
      padding: 0 var(--spacing-xl) !important;
      height: 48px !important;
      border-radius: var(--radius-sm) !important;
      font-weight: 600 !important;
      font-size: 0.9375rem !important;
      transition: all 0.2s ease !important;
      border: 2px solid var(--azure-primary) !important;
      color: var(--azure-primary) !important;
    }

    .cancel-btn mat-icon {
      margin-right: var(--spacing-xs);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .cancel-btn:hover:not([disabled]) {
      background: var(--azure-surface) !important;
      color: var(--azure-primary-dark) !important;
      border-color: var(--azure-primary-dark) !important;
    }

    .submit-btn {
      flex: 2;
      padding: 0 var(--spacing-xl) !important;
      height: 48px !important;
      border-radius: var(--radius-sm) !important;
      font-weight: 600 !important;
      font-size: 0.9375rem !important;
      background-color: var(--azure-primary) !important;
      color: white !important;
      transition: all 0.2s ease !important;
      box-shadow: var(--shadow-sm);
    }

    .submit-btn mat-icon {
      margin-right: var(--spacing-xs);
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: white;
    }

    .submit-btn:hover:not([disabled]) {
      background-color: var(--azure-primary-dark) !important;
      box-shadow: var(--shadow-md);
    }

    .submit-btn:disabled {
      background-color: #C8C6C4 !important;
      color: #A19F9D !important;
      cursor: not-allowed;
      box-shadow: none;
    }

    .submit-spinner {
      margin-right: var(--spacing-xs);
    }

    .submit-spinner ::ng-deep circle {
      stroke: white;
    }

    /* Material Design Overrides - Azure Theme */
    ::ng-deep .mat-mdc-form-field {
      margin-bottom: 4px;
    }
    
    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: white !important;
      border-radius: var(--radius-sm);
    }
    
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-start,
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-notch,
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-end {
      border-color: var(--azure-border) !important;
      background-color: white !important;
    }
    
    ::ng-deep .mat-mdc-form-field-appearance-outline.mat-focused .mat-mdc-form-field-outline-thick {
      color: var(--azure-primary) !important;
      border-width: 2px !important;
    }
    
    ::ng-deep .mat-mdc-form-field-appearance-outline.mat-form-field-invalid .mat-mdc-form-field-outline-thick {
      color: var(--azure-error) !important;
      border-width: 2px !important;
    }
    
    ::ng-deep .mat-mdc-input-element {
      background-color: transparent !important;
      color: var(--azure-text-primary) !important;
      font-weight: 400;
    }
    
    ::ng-deep .mat-mdc-select {
      background-color: transparent !important;
    }
    
    ::ng-deep .mat-mdc-select-value {
      color: var(--azure-text-primary) !important;
      font-weight: 400;
    }

    ::ng-deep .mat-mdc-select-arrow {
      color: var(--azure-text-secondary);
    }

    ::ng-deep .mat-mdc-form-field-hint,
    ::ng-deep .mat-mdc-form-field-error {
      font-size: 0.75rem;
      font-weight: 400;
      margin-top: 4px;
    }

    ::ng-deep .mat-mdc-form-field-error {
      color: var(--azure-error);
    }

    ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: transparent !important;
    }

    /* Checkbox - Azure Blue */
    ::ng-deep .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
      background-color: var(--azure-primary) !important;
      border-color: var(--azure-primary) !important;
    }

    ::ng-deep .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:focus:checked ~ .mdc-checkbox__background {
      background-color: var(--azure-primary) !important;
      border-color: var(--azure-primary) !important;
    }

    ::ng-deep .mat-mdc-checkbox .mdc-checkbox__ripple {
      background-color: var(--azure-primary);
    }

    /* Select Options */
    ::ng-deep .mat-mdc-option .mat-icon {
      margin-right: var(--spacing-sm);
      color: var(--azure-text-secondary);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    ::ng-deep .mat-mdc-option.mat-mdc-option-active,
    ::ng-deep .mat-mdc-option:hover {
      background: var(--azure-surface);
    }

    ::ng-deep .mat-mdc-option.mdc-list-item--selected {
      background-color: rgba(0, 120, 212, 0.08);
    }

    /* Date Picker - Azure Theme */
    ::ng-deep .mat-datepicker-toggle {
      color: var(--azure-primary) !important;
    }

    ::ng-deep .mat-mdc-icon-button.mat-datepicker-toggle {
      width: 40px !important;
      height: 40px !important;
      padding: 8px !important;
    }

    ::ng-deep .mat-mdc-form-field-input-control input[matDatepicker] {
      cursor: pointer !important;
    }

    ::ng-deep .mat-datepicker-content {
      border-radius: var(--radius-md) !important;
      box-shadow: var(--shadow-lg) !important;
    }

    ::ng-deep .mat-calendar {
      font-family: inherit !important;
    }

    ::ng-deep .mat-calendar-header {
      background-color: var(--azure-primary) !important;
      color: white !important;
      padding: var(--spacing-md);
    }

    ::ng-deep .mat-calendar-table-header th {
      color: var(--azure-text-secondary) !important;
      font-weight: 600 !important;
    }

    ::ng-deep .mat-calendar-body-selected {
      background-color: var(--azure-primary) !important;
      color: white !important;
    }

    ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) {
      border-color: var(--azure-primary) !important;
    }

    ::ng-deep .mat-calendar-body-cell:hover .mat-calendar-body-cell-content:not(.mat-calendar-body-selected) {
      background-color: rgba(0, 120, 212, 0.08);
    }

    /* Scrollbar */
    .booking-content::-webkit-scrollbar {
      width: 8px;
    }

    .booking-content::-webkit-scrollbar-track {
      background: var(--azure-border-light);
      border-radius: 4px;
    }

    .booking-content::-webkit-scrollbar-thumb {
      background: #C8C6C4;
      border-radius: 4px;
    }

    .booking-content::-webkit-scrollbar-thumb:hover {
      background: #A19F9D;
    }

    /* Responsive Design */
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

      .booking-content {
        padding: var(--spacing-xl);
        gap: var(--spacing-md);
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .actions-container {
        flex-direction: column;
        padding: var(--spacing-lg);
      }

      .tour-details {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .booking-container {
        margin: 8px;
        max-height: calc(100vh - 16px);
      }

      .booking-header {
        padding: var(--spacing-lg);
      }

      .booking-content {
        padding: var(--spacing-lg);
      }

      .actions-container {
        padding: var(--spacing-md);
      }

      .cancel-btn,
      .submit-btn {
        height: 44px !important;
      }
    }
  `]
})
export class BookingDialogComponent implements OnInit {
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;

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


  openDatePicker(): void {
    if (this.datePicker) {
      this.datePicker.open();
    }
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
        tourTitle: this.data.tour.title,
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