import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactService } from '../../../services/contact.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>Contact Us</h1>
          <p class="hero-subtitle">We'd love to hear from you. Get in touch with us.</p>
        </div>
      </section>

      <div class="container content-grid">
        <!-- Contact Details -->
        <div class="details-column">
          <mat-card class="details-card">
            <mat-card-header>
              <mat-card-title>Get in Touch</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="contact-item">
                <div class="icon-wrapper">
                  <mat-icon>location_on</mat-icon>
                </div>
                <div class="info">
                  <h3>Address</h3>
                  <p>Lilly Palace Villa Guest House<br>432/14 2nd Kurana road, Negombo</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="icon-wrapper">
                  <mat-icon>email</mat-icon>
                </div>
                <div class="info">
                  <h3>Email</h3>
                  <p>info&#64;ceylondeafadventures.com</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="icon-wrapper">
                  <mat-icon>phone</mat-icon>
                </div>
                <div class="info">
                  <h3>Phone / WhatsApp</h3>
                  <p>+94 765535051</p>
                </div>
              </div>
              
              <div class="social-links">
                <a href="#" class="social-btn"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-btn"><i class="fab fa-whatsapp"></i></a>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Contact Form -->
        <div class="form-column">
          <mat-card class="form-card">
            <mat-card-header>
              <mat-card-title>Send us a Message</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Your Name</mat-label>
                  <input matInput formControlName="name" placeholder="John Doe">
                  <mat-error *ngIf="contactForm.get('name')?.invalid">Name is required</mat-error>
                </mat-form-field>

                <div class="row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Email Address</mat-label>
                    <input matInput formControlName="email" placeholder="john@example.com" type="email">
                    <mat-error *ngIf="contactForm.get('email')?.invalid">Valid email is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Phone Number (Optional)</mat-label>
                    <input matInput formControlName="phone" placeholder="+94 77..." type="tel">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Message</mat-label>
                  <textarea matInput formControlName="message" rows="5" placeholder="How can we help you?"></textarea>
                  <mat-error *ngIf="contactForm.get('message')?.invalid">Message is required</mat-error>
                </mat-form-field>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="contactForm.invalid || isSubmitting" class="submit-btn">
                    <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
                    <span *ngIf="!isSubmitting">Send Message</span>
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background-color: var(--background-color);
    }

    .hero-section {
      background: linear-gradient(rgba(11, 31, 58, 0.9), rgba(11, 31, 58, 0.8)), url('/assets/images/contact-hero.jpg');
      background-size: cover;
      background-position: center;
      padding: 100px 24px;
      text-align: center;
      color: white;
      margin-bottom: -60px;
    }

    .hero-content h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 16px;
      color: #f4b416;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 32px;
      position: relative;
      z-index: 10;
      margin-bottom: 80px;
    }

    @media (max-width: 900px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .details-card, .form-card {
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      height: 100%;
    }

    .details-card {
      background-color: #0b1f3a;
      color: white;
    }

    .details-card mat-card-title {
      color: #f4b416;
      font-size: 1.5rem;
      margin-bottom: 24px;
    }

    .contact-item {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      background-color: rgba(244, 180, 22, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-wrapper mat-icon {
      color: #f4b416;
    }

    .info h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #f4b416;
    }

    .info p {
      margin: 0;
      opacity: 0.9;
      line-height: 1.5;
    }
    
    .social-links {
        display: flex;
        gap: 16px;
        margin-top: 48px;
    }
    
    .social-btn {
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: all 0.3s ease;
    }
    
    .social-btn:hover {
        background: #f4b416;
        color: #0b1f3a;
        transform: translateY(-3px);
    }

    .form-card {
      padding: 24px;
    }

    .form-card mat-card-title {
      color: #0b1f3a;
      font-size: 1.75rem;
      margin-bottom: 8px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .full-width {
      width: 100%;
    }

    .row {
      display: flex;
      gap: 16px;
    }

    .half-width {
      flex: 1;
    }

    @media (max-width: 600px) {
      .row {
        flex-direction: column;
        gap: 0;
      }
    }

    .submit-btn {
      padding: 0 32px;
      height: 48px;
      font-size: 1rem;
      border-radius: 8px;
      background-color: #0b1f3a !important;
      color: #f4b416 !important;
      width: 100%;
    }
    
    .submit-btn:disabled {
        background-color: #ccc !important;
        color: #666 !important;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  `]
})
export class ContactPageComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''], // Optional
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      try {
        await this.contactService.sendMessage(this.contactForm.value);
        this.snackBar.open('Message sent successfully! We will get back to you soon.', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.contactForm.reset();
        Object.keys(this.contactForm.controls).forEach(key => {
          this.contactForm.get(key)?.setErrors(null);
        });
      } catch (error) {
        console.error('Error sending message:', error);
        this.snackBar.open('Failed to send message. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
