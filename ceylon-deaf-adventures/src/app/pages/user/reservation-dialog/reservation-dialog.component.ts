import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../models/product.model';
import { ShopService } from '../../../services/shop.service';

@Component({
    selector: 'app-reservation-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    template: `
    <h2 mat-dialog-title>Reserve {{data.product.title}}</h2>
    <mat-dialog-content>
      <p>Since we are currently upgrading our payment systems, please leave your details below and we will reserve this item for you. Our team will contact you shortly to arrange payment and delivery.</p>
      
      <form [formGroup]="reservationForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Your Name</mat-label>
          <input matInput formControlName="customerName" placeholder="John Doe">
          <mat-error *ngIf="reservationForm.get('customerName')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="customerEmail" placeholder="john@example.com">
          <mat-error *ngIf="reservationForm.get('customerEmail')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="reservationForm.get('customerEmail')?.hasError('email')">Invalid email address</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="customerPhone" placeholder="+94 77 123 4567">
          <mat-error *ngIf="reservationForm.get('customerPhone')?.hasError('required')">Phone number is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Message (Optional)</mat-label>
          <textarea matInput formControlName="message" rows="3" placeholder="Any special requests?"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="reservationForm.invalid || isSubmitting" (click)="onSubmit()">
        {{ isSubmitting ? 'Reserving...' : 'Reserve Now' }}
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }
    p {
      margin-bottom: 16px;
      color: rgba(0,0,0,0.6);
    }
  `]
})
export class ReservationDialogComponent {
    private fb = inject(FormBuilder);
    private shopService = inject(ShopService);
    isSubmitting = false;

    reservationForm = this.fb.group({
        customerName: ['', Validators.required],
        customerEmail: ['', [Validators.required, Validators.email]],
        customerPhone: ['', Validators.required],
        message: ['']
    });

    constructor(
        public dialogRef: MatDialogRef<ReservationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { product: Product }
    ) { }

    async onSubmit() {
        if (this.reservationForm.invalid) return;

        this.isSubmitting = true;
        try {
            await this.shopService.createReservation({
                productId: this.data.product.id!,
                productName: this.data.product.title,
                customerName: this.reservationForm.value.customerName!,
                customerEmail: this.reservationForm.value.customerEmail!,
                customerPhone: this.reservationForm.value.customerPhone!,
                message: this.reservationForm.value.message || '',
                status: 'pending'
            });
            this.dialogRef.close(true);
        } catch (error) {
            console.error('Error creating reservation:', error);
            // Handle error (show snackbar ideally)
        } finally {
            this.isSubmitting = false;
        }
    }
}
