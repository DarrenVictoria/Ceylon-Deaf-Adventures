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
          <div class="header-icon-wrapper">
            <mat-icon class="header-main-icon">calendar_today</mat-icon>
          </div>
          <div class="header-text">
            <span class="header-subtitle">Start Your Adventure</span>
            <h2 class="booking-title">Book {{ data.tour.title }}</h2>
          </div>
        </div>
        <button mat-icon-button class="close-button" (click)="onCancel()" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <!-- Content Section -->
      <div class="booking-content">
        <!-- Tour Key Info Summary -->
        <div class="tour-summary-bar">
          <div class="summary-item">
            <mat-icon>schedule</mat-icon>
            <span>{{ data.tour.durationDays }} Days / {{ data.tour.durationNights || (data.tour.durationDays > 1 ? data.tour.durationDays - 1 : 0) }} Nights</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <mat-icon>category</mat-icon>
            <span>{{ data.tour.type | titlecase }}</span>
          </div>
           <div class="summary-divider"></div>
          <div class="summary-item">
            <mat-icon>attach_money</mat-icon>
            <span class="price-highlight">{{ data.tour.currency }} {{ data.tour.priceDisplay }} <small>pp</small></span>
          </div>
        </div>

        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          
          <!-- Personal Information Section -->
          <section class="form-section">
            <div class="section-label">
              <mat-icon class="section-icon">person_outline</mat-icon>
              <h3>Personal Details</h3>
            </div>
            
            <div class="form-grid">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="guestName" autocomplete="name" placeholder="E.g. John Doe">
                <mat-error *ngIf="bookingForm.get('guestName')?.hasError('required')">Name is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="guestEmail" autocomplete="email" placeholder="john@example.com">
                <mat-error *ngIf="bookingForm.get('guestEmail')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="bookingForm.get('guestEmail')?.hasError('email')">Invalid email address</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="guestPhone" autocomplete="tel" placeholder="+1 234 567 8900">
                <mat-icon matSuffix>phone</mat-icon>
                <mat-hint>For tour updates via WhatsApp/SMS</mat-hint>
              </mat-form-field>
            </div>
          </section>

          <mat-divider class="section-divider"></mat-divider>

          <!-- Trip Details Section -->
          <section class="form-section">
            <div class="section-label">
              <mat-icon class="section-icon">flight_takeoff</mat-icon>
              <h3>Trip Details</h3>
            </div>

            <div class="form-grid">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="tourDate" [min]="minDate" (click)="openDatePicker()">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="bookingForm.get('tourDate')?.hasError('required')">Date is required</mat-error>
              </mat-form-field>

              <div class="guest-count-wrapper">
                 <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Guests</mat-label>
                  <input matInput type="number" formControlName="numPeople" [min]="1" [max]="data.tour.capacity">
                  <mat-icon matSuffix>group</mat-icon>
                  <span matTextPrefix>Adults:&nbsp;</span>
                  <mat-error *ngIf="bookingForm.get('numPeople')?.hasError('required')">Required</mat-error>
                </mat-form-field>
                 <div class="capacity-hint" *ngIf="data.tour.capacity < 10 && data.tour.capacity > 0">
                    Only {{data.tour.capacity}} spots left!
                 </div>
              </div>
             

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Accommodation Preference</mat-label>
                 <mat-select formControlName="stayType">
                    <mat-option value="Homestay">Homestay (Local Experience)</mat-option>
                    <mat-option value="Guesthouse">Guesthouse (Comfort)</mat-option>
                    <mat-option value="Villa">Villa (Luxury)</mat-option>
                    <mat-option value="Hotel3to5">Hotel 3-5 Stars</mat-option>
                    <mat-option value="Camping">Camping (Adventure)</mat-option>
                  </mat-select>
              </mat-form-field>
            </div>
          </section>

          <!-- Pricing Estimate Card -->
          <div class="pricing-card">
              <ng-container *ngIf="data.tour.isNegotiable || data.tour.priceDisplay === 0; else standardPricing">
                  <div class="pricing-header">
                      <div class="pricing-title">Price Negotiable</div>
                      <div class="pricing-subtitle">Submit your booking request and we will contact you to discuss the price.</div>
                  </div>
                  
                  <div class="contact-info-box">
                      <mat-icon>phone</mat-icon>
                      <span>Call us to negotiate: <strong>+94 76 666 6666</strong></span>
                  </div>
              </ng-container>

              <ng-template #standardPricing>
                  <div class="pricing-header">
                      <div class="pricing-title">Estimated Cost</div>
                      <div class="pricing-subtitle">Total based on {{ bookingForm.get('numPeople')?.value }} guest(s)</div>
                  </div>
                  
                  <div class="pricing-calculator" *ngIf="bookingForm.get('numPeople')?.value > 0">
                      <div class="calc-row">
                          <span>{{ bookingForm.get('numPeople')?.value }} Guest(s) x {{ data.tour.currency }} {{ data.tour.priceDisplay }}</span>
                          <span class="calc-val">{{ data.tour.currency }} {{ calculateSuggestedTotal() }}</span>
                      </div>
                  </div>

                   <mat-form-field appearance="outline" class="bid-field">
                      <mat-label>Total Amount ({{ data.tour.currency }})</mat-label>
                      <input matInput type="number" formControlName="totalPrice" [min]="0" step="0.01">
                      <mat-icon matSuffix>payments</mat-icon>
                   </mat-form-field>
              </ng-template>
          </div>

          <!-- Feature Toggles -->
          <div class="options-container">
             <mat-checkbox formControlName="guideRequired" color="primary" class="feature-checkbox">
                <span class="checkbox-label">
                    <span class="label-title">Request Certified Deaf Guide</span>
                    <span class="label-desc">Includes full Sign Language interpretation</span>
                </span>
             </mat-checkbox>
          </div>

          <!-- Special Requests -->
           <mat-form-field appearance="outline" class="form-field-full mt-4">
              <mat-label>Special Requests / Dietary Needs</mat-label>
              <textarea matInput formControlName="specialRequests" rows="3" maxlength="500" placeholder="E.g. Vegetarian meals, wheelchair access..."></textarea>
              <mat-hint align="end">{{ getCharacterCount() }}/500</mat-hint>
          </mat-form-field>

          <!-- Error Display -->
          <div *ngIf="errorMessage" class="error-banner">
            <mat-icon>error_outline</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>

        </form>
      </div>

      <!-- Footer Actions -->
      <div class="booking-footer">
        <div class="terms-text">
            By booking, you agree to our <a href="#">Terms</a> & <a href="#">Cancellation Policy</a>.
        </div>
        <div class="action-buttons">
            <button mat-button class="cancel-link" (click)="onCancel()" [disabled]="isSubmitting">Cancel</button>
            <button mat-raised-button color="primary" class="confirm-btn" (click)="onSubmit()" [disabled]="bookingForm.invalid || isSubmitting">
                <mat-spinner *ngIf="isSubmitting" diameter="20" class="btn-spinner"></mat-spinner>
                <span *ngIf="!isSubmitting">Confirm Booking Request</span>
            </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #0b1f3a;
      --primary-light: #1e3a5f;
      --accent: #f4b416;
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --surface: #ffffff;
      --surface-alt: #f8fafc;
      --border: #e2e8f0;
      --radius-lg: 16px;
      --radius-md: 8px;
    }

    .booking-container {
      background: var(--surface);
      max-width: 600px;
      width: 100%;
      height: 90vh; /* Fixed height for modal feel */
      max-height: 800px;
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    /* Header */
    .booking-header {
        background: var(--primary);
        color: white;
        padding: 24px 32px;
        position: relative;
        display: flex;
        justify-content: space-between; /* Icon+Text left, Close Button right */
        align-items: flex-start;
        overflow: hidden;
    }

    .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 10;
    }

    .header-icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(5px);
    }
    
    .header-text {
        display: flex;
        flex-direction: column;
    }

    .header-subtitle {
        color: var(--accent);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
    }

    .booking-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.2;
    }

    .close-button {
       color: rgba(255,255,255,0.7);
       margin: -8px -8px 0 0;
    }
    
    .close-button:hover {
        color: white;
        background: rgba(255,255,255,0.1);
    }

    /* Content Area */
    .booking-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px 32px;
        background: var(--surface);
    }
    
    /* Tour Summary Bar */
    .tour-summary-bar {
        display: flex;
        align-items: center;
        gap: 16px;
        background: var(--surface-alt);
        padding: 12px 16px;
        border-radius: var(--radius-md);
        margin-bottom: 24px;
        border: 1px solid var(--border);
        flex-wrap: wrap;
    }
    
    .summary-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-main);
    }
    
    .summary-item mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--text-muted);
    }
    
    .summary-divider {
        width: 1px;
        height: 20px;
        background: var(--border);
    }
    
    .price-highlight {
        color: var(--primary);
        font-weight: 700;
    }

    /* Form Sections */
    .form-section {
        margin-bottom: 24px;
    }
    
    .section-label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        color: var(--primary);
    }
    
    .section-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
    }
    
    .section-label h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
    }
    
    .form-field {
        width: 100%;
    }
     
    .form-field-full {
        width: 100%;
    }

    .section-divider {
        margin: 24px 0;
    }

    /* Pricing Card */
    .pricing-card {
        background: linear-gradient(135deg, #f8fafc, #edf2f7);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 20px;
        margin-bottom: 24px;
    }
    
    .pricing-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 12px;
    }
    
    .pricing-title {
        font-weight: 600;
        color: var(--primary);
    }
    
    .pricing-subtitle {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .contact-info-box {
        background: #EFF6FF;
        border: 1px solid #BFDBFE;
        border-radius: var(--radius-md);
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--primary);
        margin-top: 16px;
    }
    
    .contact-info-box mat-icon {
        color: var(--primary);
    }
    
    .pricing-calculator {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px dashed var(--border);
    }
    
    .calc-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: var(--text-main);
    }
    
    .calc-val {
        font-weight: 600;
    }

    .bid-field {
        width: 100%;
        margin-bottom: 0;
    }
    
    /* Options & Checkboxes */
    .options-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 16px;
    }
    
    .feature-checkbox {
        background: var(--surface-alt);
        padding: 12px;
        border-radius: var(--radius-md);
        border: 1px solid transparent;
        transition: all 0.2s;
    }
    
    .feature-checkbox:hover {
        border-color: var(--primary);
    }

    .checkbox-label {
        display: flex;
        flex-direction: column;
        margin-left: 8px;
    }
    
    .label-title {
        font-weight: 500;
        color: var(--text-main);
    }
    
    .label-desc {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    /* Error Banner */
    .error-banner {
        background: #fee2e2;
        color: #b91c1c;
        padding: 12px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        font-size: 0.9rem;
    }
    
    .mt-4 { margin-top: 16px; }

    /* Footer */
    .booking-footer {
        padding: 16px 32px 24px;
        background: var(--surface);
        border-top: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .terms-text {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-align: center;
    }
    
    .terms-text a {
        color: var(--primary);
        text-decoration: none;
    }

    .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
    
    .confirm-btn {
        flex: 1;
        padding: 24px !important; /* Taller button */
        font-size: 1rem !important;
        font-weight: 600;
        border-radius: var(--radius-md) !important;
        max-width: 300px;
    }
    
    .cancel-link {
        color: var(--text-muted);
    }
    
    .btn-spinner {
        margin-right: 8px;
    }
    
    ::ng-deep .btn-spinner circle {
        stroke: white;
    }

    /* Responsive */
    @media (max-width: 600px) {
        .booking-container {
            height: 100vh;
            max-height: none;
            border-radius: 0;
        }
        
        .booking-header, .booking-content, .booking-footer {
            padding-left: 20px;
            padding-right: 20px;
        }
        
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .action-buttons {
            flex-direction: column-reverse;
        }
        
        .confirm-btn {
            max-width: 100%;
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
    const isNegotiable = this.data.tour.isNegotiable || this.data.tour.priceDisplay === 0;

    this.bookingForm = this.fb.group({
      guestName: ['', [Validators.required, Validators.minLength(2)]],
      guestEmail: ['', [Validators.required, Validators.email]],
      guestPhone: [''],
      tourDate: [null, Validators.required],
      numPeople: [1, [Validators.required, Validators.min(1), Validators.max(this.data.tour.capacity)]],
      totalPrice: [isNegotiable ? 0 : this.data.tour.priceDisplay, isNegotiable ? [] : [Validators.required, Validators.min(0)]],
      stayType: ['Homestay', Validators.required],
      specialRequests: [''],
      guideRequired: [true]
    });
  }

  private setupFormSubscriptions() {
    this.bookingForm.get('numPeople')?.valueChanges.subscribe(numPeople => {
      // Auto-update price if it matches standard calculation
      if (numPeople && numPeople > 0) {
        // Logic: If user hasn't manually edited price drastically, update it
        // OR simply update the "suggested" price display and let them verify
      }
      this.cdr.markForCheck();
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
      this.bookingForm.markAllAsTouched();
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
        'Request Sent! We will contact you shortly.',
        'OK',
        {
          duration: 5000,
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
    this.dialogRef.close({ success: false });
  }

  private getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'An unexpected error occurred. Please try again.';
  }
}