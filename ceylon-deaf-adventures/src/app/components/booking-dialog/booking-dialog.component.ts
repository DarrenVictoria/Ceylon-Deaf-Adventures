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
import { LucideAngularModule } from 'lucide-angular';
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
    LucideAngularModule
  ],
  template: `
    <div class="booking-container">
      <!-- Header Section -->
      <div class="booking-header">
        <div class="header-content">
          <div class="header-icon">
            <lucide-icon name="calendar-check" [size]="32"></lucide-icon>
          </div>
          <div class="header-text">
            <h2 class="booking-title">Book Your Adventure</h2>
            <p class="tour-name">{{ data.tour.title }}</p>
            <div class="tour-details">
              <span class="tour-duration">{{ data.tour.durationDays }} {{ data.tour.durationDays === 1 ? 'Day' : 'Days' }}</span>
              <span class="tour-separator">•</span>
              <span class="tour-type">{{ data.tour.type | titlecase }}</span>
            </div>
          </div>
        </div>
        <button mat-icon-button class="close-button" (click)="onCancel()">
          <lucide-icon name="x" [size]="24"></lucide-icon>
        </button>
      </div>
      
      <!-- Content Section -->
      <div class="booking-content">
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <!-- Personal Information Section -->
          <div class="form-section">
            <h3 class="section-title">
              <lucide-icon name="user" [size]="20"></lucide-icon>
              Personal Information
            </h3>
            <div class="form-grid">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Full Name *</mat-label>
                <input 
                  matInput 
                  formControlName="guestName" 
                  placeholder="Enter your full name"
                  autocomplete="name"
                >
                @if (bookingForm.get('guestName')?.invalid && bookingForm.get('guestName')?.touched) {
                  <mat-error>
                    @if (bookingForm.get('guestName')?.errors?.['required']) {
                      Name is required
                    } @else if (bookingForm.get('guestName')?.errors?.['minlength']) {
                      Name must be at least 2 characters long
                    }
                  </mat-error>
                }
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
                <mat-icon matSuffix>
                  <lucide-icon name="mail" [size]="20"></lucide-icon>
                </mat-icon>
                @if (bookingForm.get('guestEmail')?.invalid && bookingForm.get('guestEmail')?.touched) {
                  <mat-error>
                    @if (bookingForm.get('guestEmail')?.errors?.['required']) {
                      Email is required
                    } @else if (bookingForm.get('guestEmail')?.errors?.['email']) {
                      Please enter a valid email address
                    }
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Phone Number</mat-label>
                <input 
                  matInput 
                  formControlName="guestPhone" 
                  placeholder="+94 XX XXX XXXX"
                  autocomplete="tel"
                >
                <mat-icon matSuffix>
                  <lucide-icon name="phone" [size]="20"></lucide-icon>
                </mat-icon>
              </mat-form-field>
            </div>
          </div>

          <!-- Tour Details Section -->
          <div class="form-section">
            <h3 class="section-title">
              <lucide-icon name="map-pin" [size]="20"></lucide-icon>
              Tour Details
            </h3>
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
                @if (bookingForm.get('tourDate')?.invalid && bookingForm.get('tourDate')?.touched) {
                  <mat-error>Please select a tour date</mat-error>
                }
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
                <mat-icon matSuffix>
                  <lucide-icon name="users" [size]="20"></lucide-icon>
                </mat-icon>
                @if (bookingForm.get('numPeople')?.invalid && bookingForm.get('numPeople')?.touched) {
                  <mat-error>
                    @if (bookingForm.get('numPeople')?.errors?.['required']) {
                      Number of people is required
                    } @else if (bookingForm.get('numPeople')?.errors?.['min']) {
                      At least 1 person is required
                    } @else if (bookingForm.get('numPeople')?.errors?.['max']) {
                      Maximum {{ data.tour.capacity }} people allowed
                    }
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Preferred Stay Type *</mat-label>
                <mat-select formControlName="stayType">
                  <mat-option value="Homestay">
                    <div class="select-option">
                      <lucide-icon name="home" [size]="16"></lucide-icon>
                      <span>Homestay</span>
                    </div>
                  </mat-option>
                  <mat-option value="Guesthouse">
                    <div class="select-option">
                      <lucide-icon name="building" [size]="16"></lucide-icon>
                      <span>Guesthouse</span>
                    </div>
                  </mat-option>
                  <mat-option value="Villa">
                    <div class="select-option">
                      <lucide-icon name="castle" [size]="16"></lucide-icon>
                      <span>Villa</span>
                    </div>
                  </mat-option>
                  <mat-option value="Hotel3to5">
                    <div class="select-option">
                      <lucide-icon name="bed" [size]="16"></lucide-icon>
                      <span>Hotel 3-5 Stars</span>
                    </div>
                  </mat-option>
                  <mat-option value="Camping">
                    <div class="select-option">
                      <lucide-icon name="tent" [size]="16"></lucide-icon>
                      <span>Camping</span>
                    </div>
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <!-- Pricing Section -->
          <div class="form-section">
            <h3 class="section-title">
              <lucide-icon name="dollar-sign" [size]="20"></lucide-icon>
              Pricing
            </h3>
            
            <div class="price-display">
              <div class="price-info">
                <div class="suggested-price">
                  <span class="price-label">Suggested Price</span>
                  <span class="price-value">$ {{ data.tour.priceDisplay }} {{ data.tour.currency }}</span>
                  <span class="price-per">per person</span>
                </div>
                <div class="total-calculation" *ngIf="bookingForm.get('numPeople')?.value">
                  <span class="calc-label">{{ bookingForm.get('numPeople')?.value }} people × $ {{ data.tour.priceDisplay }} =</span>
                  <span class="calc-total">$ {{ calculateSuggestedTotal() }}</span>
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
                placeholder="Enter your bid amount"
              >
              <span matTextPrefix>$</span>
              <mat-icon matSuffix>
                <lucide-icon name="tag" [size]="20"></lucide-icon>
              </mat-icon>
              <mat-hint>You can negotiate the price. We'll review your offer.</mat-hint>
              @if (bookingForm.get('totalPrice')?.invalid && bookingForm.get('totalPrice')?.touched) {
                <mat-error>
                  @if (bookingForm.get('totalPrice')?.errors?.['required']) {
                    Please enter your bid price
                  } @else if (bookingForm.get('totalPrice')?.errors?.['min']) {
                    Price cannot be negative
                  }
                </mat-error>
              }
            </mat-form-field>
          </div>

          <!-- Accessibility Section -->
          <div class="form-section">
            <h3 class="section-title">
              <lucide-icon name="accessibility" [size]="20"></lucide-icon>
              Accessibility & Guide Options
            </h3>
            
            <div class="checkbox-container">
              <mat-checkbox formControlName="guideRequired" class="guide-checkbox">
                <div class="checkbox-content">
                  <div class="checkbox-title">Require Deaf Guide with Sign Language Support</div>
                  <div class="checkbox-description">
                    Our certified deaf guides provide full sign language interpretation throughout your tour
                  </div>
                </div>
              </mat-checkbox>
            </div>
          </div>

          <!-- Special Requests Section -->
          <div class="form-section">
            <h3 class="section-title">
              <lucide-icon name="message-square" [size]="20"></lucide-icon>
              Additional Information
            </h3>
            
            <mat-form-field appearance="outline" class="form-field-full">
              <mat-label>Special Requests or Dietary Requirements</mat-label>
              <textarea 
                matInput 
                formControlName="specialRequests" 
                rows="4" 
                placeholder="Please let us know about any dietary restrictions, accessibility needs, medical conditions, or special requests..."
                maxlength="500"
              ></textarea>
              <mat-hint align="end">{{ getCharacterCount() }}/500</mat-hint>
            </mat-form-field>
          </div>

          <!-- Error Display -->
          @if (errorMessage) {
            <div class="error-message">
              <lucide-icon name="alert-circle" [size]="20"></lucide-icon>
              <span>{{ errorMessage }}</span>
            </div>
          }
        </form>

        <!-- Terms and Conditions -->
        <div class="terms-section">
          <div class="terms-content">
            <lucide-icon name="info" [size]="16"></lucide-icon>
            <span>
              By submitting this booking request, you agree to our 
              <a href="#" class="terms-link">terms and conditions</a> and 
              <a href="#" class="terms-link">cancellation policy</a>.
            </span>
          </div>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="actions-container">
        <button 
          type="button" 
          class="btn-cancel" 
          (click)="onCancel()" 
          [disabled]="isSubmitting"
        >
          <lucide-icon name="x" [size]="18"></lucide-icon>
          Cancel
        </button>
        <button 
          type="button" 
          class="btn-submit" 
          (click)="onSubmit()" 
          [disabled]="!bookingForm.valid || isSubmitting"
        >
          @if (isSubmitting) {
            <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
            Processing Request...
          } @else {
            <lucide-icon name="send" [size]="18"></lucide-icon>
            Submit Booking Request
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .booking-container {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    
    .booking-header {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: white;
      padding: 2rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }
    
    .header-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 1rem;
      padding: 1rem;
      backdrop-filter: blur(10px);
    }
    
    .header-text {
      flex: 1;
    }
    
    .booking-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }
    
    .tour-name {
      font-size: 1.125rem;
      opacity: 0.9;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }
    
    .tour-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      opacity: 0.8;
    }
    
    .tour-separator {
      opacity: 0.6;
    }
    
    .close-button {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      border-radius: 50% !important;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease !important;
      width: 44px !important;
      height: 44px !important;
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: scale(1.05);
    }
    
    .booking-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }
    
    .form-section {
      margin-bottom: 2rem;
    }
    
    .form-section:last-child {
      margin-bottom: 0;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
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
      gap: 0.5rem;
    }
    
    .price-display {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .price-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .suggested-price {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .price-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }
    
    .price-value {
      font-size: 2rem;
      font-weight: 700;
      color: #3b82f6;
      line-height: 1;
    }
    
    .price-per {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    .total-calculation {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }
    
    .calc-label {
      font-size: 0.875rem;
      color: #64748b;
    }
    
    .calc-total {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .checkbox-container {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 1.5rem;
    }
    
    .guide-checkbox {
      width: 100%;
    }
    
    .checkbox-content {
      margin-left: 0.5rem;
    }
    
    .checkbox-title {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .checkbox-description {
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.4;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #dc2626;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1rem 0;
      font-size: 0.875rem;
    }
    
    .terms-section {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }
    
    .terms-content {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.4;
    }
    
    .terms-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    
    .terms-link:hover {
      text-decoration: underline;
    }
    
    .actions-container {
      display: flex;
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      flex-shrink: 0;
    }
    
    .btn-cancel {
      flex: 1;
      background: white;
      color: #64748b;
      border: 1px solid #cbd5e1;
      padding: 0.875rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    
    .btn-cancel:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #94a3b8;
      transform: translateY(-1px);
    }
    
    .btn-cancel:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-submit {
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
      font-size: 0.875rem;
    }
    
    .btn-submit:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .btn-submit:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .inline-spinner {
      display: inline-block !important;
    }
    
    .inline-spinner ::ng-deep circle {
      stroke: white !important;
    }
    
    /* Scrollbar styling */
    .booking-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .booking-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    .booking-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    
    .booking-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    /* Material Design overrides */
    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }
    
    ::ng-deep .mat-mdc-form-field .mat-mdc-text-field-wrapper {
      border-radius: 0.5rem;
    }
    
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-thick {
      border-color: #3b82f6;
    }
    
    ::ng-deep .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
      background-color: #3b82f6;
      border-color: #3b82f6;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .booking-header {
        padding: 1.5rem;
      }
      
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .booking-content {
        padding: 1.5rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .price-info {
        flex-direction: column;
        text-align: center;
      }
      
      .total-calculation {
        align-items: center;
      }
      
      .actions-container {
        flex-direction: column;
        padding: 1.5rem;
      }
      
      .terms-content {
        text-align: center;
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      .booking-container {
        margin: 0.5rem;
        max-height: calc(100vh - 1rem);
      }
      
      .booking-header {
        padding: 1rem;
      }
      
      .booking-content {
        padding: 1rem;
      }
      
      .actions-container {
        padding: 1rem;
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
    // Update total price when number of people changes
    this.bookingForm.get('numPeople')?.valueChanges.subscribe(numPeople => {
      if (numPeople && numPeople > 0) {
        const suggestedTotal = this.data.tour.priceDisplay * numPeople;
        this.bookingForm.get('totalPrice')?.setValue(suggestedTotal);
        this.cdr.markForCheck();
      }
    });

    // Clear error message when form changes
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

    // Handle specific Firebase errors
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

    // Network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
      return 'Network connection error. Please check your internet connection and try again.';
    }

    // Validation errors
    if (error?.message?.includes('validation') || error?.message?.includes('required')) {
      return 'Please fill in all required fields correctly and try again.';
    }

    return 'An unexpected error occurred while submitting your booking. Please try again or contact support if the problem continues.';
  }

  // Utility method to format phone number as user types (optional enhancement)
  onPhoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.startsWith('94')) {
        value = value.substring(0, 11);
        value = value.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
      } else {
        value = value.substring(0, 10);
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      }
    }
    this.bookingForm.get('guestPhone')?.setValue(value);
  }

  // Method to validate date selection (prevent past dates and unavailable dates)
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Don't allow dates in the past
    if (date < today) return false;

    // Don't allow dates more than 1 year in the future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (date > oneYearFromNow) return false;

    // Optionally: check against tour's available dates
    // if (this.data.tour.nextAvailableDates) {
    //   return this.data.tour.nextAvailableDates.some(availableDate => {
    //     const available = availableDate.toDate ? availableDate.toDate() : new Date(availableDate);
    //     return available.toDateString() === date.toDateString();
    //   });
    // }

    return true;
  };

  // Method to get available time slots for selected date (future enhancement)
  getAvailableTimeSlots(): string[] {
    // This could be enhanced to show available time slots based on the selected date
    return ['09:00 AM', '02:00 PM'];
  }

  // Method to calculate price breakdown (future enhancement)
  getPriceBreakdown() {
    const numPeople = this.bookingForm.get('numPeople')?.value || 1;
    const basePrice = this.data.tour.priceDisplay;
    const subtotal = basePrice * numPeople;
    const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
    const total = subtotal + serviceFee;

    return {
      basePrice,
      numPeople,
      subtotal,
      serviceFee,
      total
    };
  }

  // Method to check tour availability for selected date (future enhancement)
  async checkAvailability(date: Date): Promise<boolean> {
    try {
      // This would call the BookingsService to check availability
      // return await this.bookingsService.checkAvailability(this.data.tour.id, date);
      return true; // Placeholder
    } catch (error) {
      console.error('Error checking availability:', error);
      return true; // Default to available if check fails
    }
  }
}