import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { ToursService } from '../../../services/tours.service';
import { Tour } from '../../../models/tour';
import { Observable, combineLatest, startWith, Subject, BehaviorSubject } from 'rxjs';
import { map, takeUntil, debounceTime, distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingDialogComponent } from '../../../components/booking-dialog/booking-dialog.component';
import { TourDetailDialogComponent } from '../../../components/tour-detail-dialog/tour-detail-dialog.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tours-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <h1 class="hero-title">
              Accessible <span class="highlight-text">Adventures</span> for Everyone
            </h1>
            <p class="hero-description">
              From whale watching to cultural immersion — discover Sri Lanka barrier-free with expert visual guides and
              sign language interpretation.
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <mat-icon class="stat-icon">tour</mat-icon>
                <span class="stat-number">{{ (allTours$ | async)?.length || 0 }}</span>
                <span class="stat-label">Tours Available</span>
              </div>
              <div class="stat-item">
                <mat-icon class="stat-icon">accessibility</mat-icon>
                <span class="stat-number">100%</span>
                <span class="stat-label">Accessible</span>
              </div>
              <div class="stat-item">
                <mat-icon class="stat-icon">groups</mat-icon>
                <span class="stat-number">1000+</span>
                <span class="stat-label">Happy Guests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <mat-card class="filter-card">
          <mat-card-content class="filter-content">
            <h3 class="filter-title">
              <mat-icon>filter_list</mat-icon>
              Find Your Perfect Tour
            </h3>
            <form [formGroup]="filterForm" class="filter-form">
              <mat-form-field  class="filter-field">
                <mat-label>Search tours...</mat-label>
                <input matInput formControlName="searchText" placeholder="Enter destination or activity">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              
              <mat-form-field  class="filter-field">
                <mat-label>Tour Type</mat-label>
                <mat-select formControlName="selectedType">
                  <mat-option value="">All Types</mat-option>
                  <mat-option value="group">
                    <mat-icon>groups</mat-icon>
                    Group Tours
                  </mat-option>
                  <mat-option value="private">
                    <mat-icon>person</mat-icon>
                    Private Tours
                  </mat-option>
                  <mat-option value="deaf_guide">
                    <mat-icon>accessibility</mat-icon>
                    Deaf Guide Tours
                  </mat-option>
                  <mat-option value="adventure">
                    <mat-icon>hiking</mat-icon>
                    Adventure Tours
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field  class="filter-field">
                <mat-label>Locations</mat-label>
                <mat-select formControlName="selectedLocations" multiple>
                  <mat-option *ngFor="let loc of uniqueLocations$ | async" [value]="loc">
                    <mat-icon>place</mat-icon>
                    {{ loc }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </section>

    <!-- Tour Cards Section -->
    <section class="tours-section">
      <div class="container">
        <!-- Loading State -->
        <div *ngIf="isLoading$ | async" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p class="loading-text">Loading amazing tours...</p>
        </div>

        <!-- No Results State -->
        <div *ngIf="!(isLoading$ | async) && (filteredTours$ | async)?.length === 0" class="no-results">
          <mat-icon class="no-results-icon">search_off</mat-icon>
          <h3 class="no-results-title">No tours found</h3>
          <p class="no-results-description">
            Try adjusting your filters or search terms to find the perfect adventure for you.
          </p>
          <button mat-raised-button color="primary" (click)="clearFilters()">
            <mat-icon>clear_all</mat-icon>
            Clear Filters
          </button>
        </div>

        <!-- Tours Grid -->
        <div *ngIf="!(isLoading$ | async) && (filteredTours$ | async)?.length! > 0" class="tours-grid">
          <mat-card 
            *ngFor="let tour of filteredTours$ | async; trackBy: trackByTourId" 
            class="tour-card"
            matRipple
          >
            <!-- Tour Image -->
            <div class="tour-image-container">
              <img
                [src]="getImageUrl(tour.images[0])"
                [alt]="tour.title"
                class="tour-image"
                (error)="onImageError($event)"
              />
              <div class="tour-overlay">
                <div class="tour-type-badge">
                  <mat-icon class="badge-icon">{{ getTypeIcon(tour.type) }}</mat-icon>
                  <span class="badge-text">{{ tour.type | titlecase }}</span>
                </div>
                <div class="tour-duration-badge">
                  <mat-icon class="badge-icon">schedule</mat-icon>
                  <span class="badge-text">{{ tour.durationDays }}{{ tour.durationDays === 1 ? ' Day' : ' Days' }}</span>
                </div>
              </div>
            </div>

            <!-- Tour Content -->
            <mat-card-content class="tour-content">
              <div class="tour-header">
                <h3 class="tour-title">{{ tour.title }}</h3>
                <div class="tour-locations">
                  <mat-chip-listbox>
                    <mat-chip *ngFor="let location of tour.location.slice(0, 2)" class="location-chip">
                      <mat-icon matChipAvatar>place</mat-icon>
                      {{ location }}
                    </mat-chip>
                    <mat-chip *ngIf="tour.location.length > 2" class="location-chip more-locations">
                      +{{ tour.location.length - 2 }} more
                    </mat-chip>
                  </mat-chip-listbox>
                </div>
              </div>

              <p class="tour-description">{{ tour.shortDescription }}</p>

              <!-- Tour Features -->
              <div class="tour-features">
                <div class="feature-item" *ngIf="tour.accessibility.visualAlarms">
                  <mat-icon class="feature-icon success">visibility</mat-icon>
                  <span class="feature-text">Visual Alarms</span>
                </div>
                <div class="feature-item" *ngIf="tour.accessibility.staffTrained">
                  <mat-icon class="feature-icon success">school</mat-icon>
                  <span class="feature-text">Trained Staff</span>
                </div>
                <div class="feature-item" *ngIf="tour.accessibility.captionsProvided">
                  <mat-icon class="feature-icon success">subtitles</mat-icon>
                  <span class="feature-text">Captions</span>
                </div>
              </div>

              <mat-divider class="content-divider"></mat-divider>

              <!-- Pricing and Actions -->
              <div class="tour-footer">
                <div class="pricing-info">
                  <span class="price-amount">{{ tour.currency }} {{ tour.priceDisplay }}</span>
                  <span class="price-per">per person</span>
                </div>
                <div class="tour-actions">
                  <button 
                    mat-stroked-button 
                    color="primary"
                    class="action-btn view-btn"
                    (click)="openDetailDialog(tour)"
                  >
                    <mat-icon>info</mat-icon>
                    Details
                  </button>
                  <button 
                    mat-raised-button 
                    color="primary"
                    class="action-btn book-btn"
                    (click)="openBookingDialog(tour)"
                  >
                    <mat-icon>event</mat-icon>
                    Book Now
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Accessibility Highlights -->
    <section class="accessibility-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Accessibility Highlights</h2>
          <p class="section-subtitle">
            Every tour designed with comprehensive accessibility features
          </p>
        </div>

        <div class="accessibility-grid">
          <mat-card class="accessibility-card" *ngFor="let feature of accessibilityFeatures" matRipple>
            <mat-card-content class="accessibility-content">
              <div class="accessibility-icon" [ngClass]="feature.gradient">
                <mat-icon>{{ feature.icon }}</mat-icon>
              </div>
              <h3 class="accessibility-title">{{ feature.title }}</h3>
              <p class="accessibility-description">{{ feature.description }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>
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

    /* Hero Section */
    .hero-section {
      position: relative;
      max-height: 70vh;
      display: flex;
      align-items: center;
      overflow: hidden;
     
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
       
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      opacity: 0.1;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 219, 187, 0.6);
      
      }

    .hero-content {
      position: relative;
      z-index: 10;
      width: 100%;
      padding: 80px 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hero-text {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.1;
      margin-bottom: 24px;
      animation: fadeInUp 1s ease-out;
    }

    .highlight-text {
      color: var(--accent-color);
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.25rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 48px;
      animation: fadeInUp 1s ease-out 0.2s both;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
      animation: fadeInUp 1s ease-out 0.4s both;
    }

    .stat-item {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .stat-icon {
      font-size: 32px;
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Filters Section */
    .filters-section {
      padding: 80px 0;
      background: linear-gradient(135deg, var(--surface-color), white);
    }

    .filter-card {
      border-radius: 20px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .filter-content {
      padding: 32px !important;
    }

    .filter-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 24px;
    }

    .filter-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .filter-field {
      width: 100%;
    }

    /* Tours Section */
    .tours-section {
      padding: 80px 0;
      background: white;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 24px;
    }

    .loading-text {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .no-results {
      text-align: center;
      padding: 80px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .no-results-icon {
      font-size: 64px;
      color: var(--text-muted);
    }

    .no-results-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .no-results-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 400px;
      line-height: 1.6;
      margin: 0;
    }

    .tours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 32px;
    }

    .tour-card {
      border-radius: 20px !important;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .tour-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .tour-image-container {
      position: relative;
      height: 240px;
      overflow: hidden;
    }

    .tour-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .tour-card:hover .tour-image {
      transform: scale(1.05);
    }

    .tour-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6));
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 16px;
    }

    .tour-type-badge,
    .tour-duration-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 8px 12px;
      color: white;
    }

    .badge-icon {
      font-size: 16px;
    }

    .badge-text {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .tour-content {
      padding: 24px !important;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tour-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tour-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .tour-locations {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .location-chip {
      background-color: rgba(var(--primary-color), 0.1) !important;
      color: var(--primary-color) !important;
      font-size: 0.75rem !important;
      height: 28px !important;
      border-radius: 14px !important;
    }

    .more-locations {
      background-color: rgba(var(--text-muted), 0.1) !important;
      color: var(--text-muted) !important;
    }

    .tour-description {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 0.9rem;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tour-features {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(var(--success-color), 0.1);
      border-radius: 16px;
      padding: 6px 12px;
    }

    .feature-icon {
      font-size: 16px;
    }

    .feature-icon.success {
      color: var(--success-color);
    }

    .feature-text {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--success-color);
    }

    .content-divider {
      margin: 8px 0 !important;
    }

    .tour-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .pricing-info {
      display: flex;
      flex-direction: column;
    }

    .price-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1;
    }

    .price-per {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .tour-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      font-size: 0.875rem !important;
      padding: 8px 16px !important;
      height: auto !important;
      border-radius: 20px !important;
      font-weight: 600 !important;
      min-width: auto !important;
    }

    .view-btn {
      border-color: var(--primary-color) !important;
      color: var(--primary-color) !important;
    }

    .book-btn {
      background-color: var(--primary-color) !important;
      color: white !important;
    }

    /* Accessibility Section */
    .accessibility-section {
      padding: 100px 0;
      background: linear-gradient(135deg, var(--surface-color), #f1f5f9);
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .section-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .accessibility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
    }

    .accessibility-card {
      border-radius: 20px !important;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .accessibility-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .accessibility-content {
      padding: 40px 32px !important;
      text-align: center;
    }

    .accessibility-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .accessibility-icon mat-icon {
      font-size: 32px;
      color: white;
    }

    .primary-gradient {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    }

    .accent-gradient {
      background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
    }

    .secondary-gradient {
      background: linear-gradient(135deg, var(--secondary-color), #a5b4fc);
    }

    .success-gradient {
      background: linear-gradient(135deg, var(--success-color), #6ee7b7);
    }

    .accessibility-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .accessibility-description {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 0.95rem;
    }

    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Material Design Overrides */
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-thick {
      border-color: var(--primary-color);
    }

    ::ng-deep .mat-mdc-option .mat-icon {
      margin-right: 12px;
      color: var(--text-secondary);
    }

    ::ng-deep .mat-mdc-chip-listbox .mat-mdc-chip {
      border-radius: 16px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-stats {
        gap: 32px;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .container {
        padding: 0 16px;
      }
      
      .filter-form {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .tours-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .tour-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
      
      .tour-actions {
        justify-content: stretch;
      }
      
      .action-btn {
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 1.1rem;
      }
      
      .hero-stats {
        flex-direction: column;
        gap: 24px;
      }
      
      .accessibility-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ToursPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading$ = new BehaviorSubject<boolean>(true);

  allTours$!: Observable<Tour[]>;
  filteredTours$!: Observable<Tour[]>;
  uniqueLocations$!: Observable<string[]>;
  filterForm!: FormGroup;

  accessibilityFeatures = [
    {
      icon: 'sign_language',
      title: 'Sign Language Guides',
      description: 'Certified Deaf guides and interpreters for every tour',
      gradient: 'primary-gradient'
    },
    {
      icon: 'visibility',
      title: 'Visual & Written Guides',
      description: 'Comprehensive visual materials and written descriptions',
      gradient: 'accent-gradient'
    },
    {
      icon: 'home',
      title: 'Accessible Stays',
      description: 'Deaf-friendly accommodations with visual alert systems',
      gradient: 'success-gradient'
    }
  ];

  constructor(
    private toursService: ToursService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.loadTours();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      searchText: [''],
      selectedType: [''],
      selectedLocations: [[]]
    });
  }

  private loadTours() {
    console.log('🏖️ Loading tours for user page...');
    // Load tours with caching
    this.allTours$ = this.toursService.listTours().pipe(
      tap((tours: Tour[]) => {
        console.log('🏖️ Tours received in user component:', tours.length);
        console.log('🏖️ Tour titles:', tours.map((t: Tour) => t.title));
      }),
      shareReplay(1),
      takeUntil(this.destroy$)
    );

    // Extract unique locations
    this.uniqueLocations$ = this.allTours$.pipe(
      map(tours => [...new Set(tours.flatMap(t => t.location))].sort()),
      shareReplay(1)
    );

    // Set up filtered tours with debouncing
    this.filteredTours$ = combineLatest([
      this.allTours$,
      this.filterForm.valueChanges.pipe(
        startWith(this.filterForm.value),
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
    ]).pipe(
      map(([tours, filters]) => this.filterTours(tours, filters)),
      shareReplay(1)
    );

    // Handle loading state
    this.allTours$.subscribe(() => {
      this.isLoading$.next(false);
    });
  }

  private filterTours(tours: Tour[], filters: any): Tour[] {
    return tours.filter(tour => {
      // Search filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        if (!tour.title.toLowerCase().includes(searchLower) &&
          !tour.shortDescription.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Type filter
      if (filters.selectedType && tour.type !== filters.selectedType) {
        return false;
      }

      // Location filter
      if (filters.selectedLocations.length &&
        !tour.location.some(location => filters.selectedLocations.includes(location))) {
        return false;
      }

      return true;
    });
  }

  trackByTourId(index: number, tour: Tour): string {
    return tour.id;
  }

  clearFilters() {
    this.filterForm.reset({
      searchText: '',
      selectedType: '',
      selectedLocations: []
    });
  }

  openBookingDialog(tour: Tour) {
    this.dialog.open(BookingDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { tour },
      panelClass: 'custom-dialog-container'
    });
  }

  openDetailDialog(tour: Tour) {
    this.dialog.open(TourDetailDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { tour },
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

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return this.getPlaceholderImage();
    }

    // If it's already a full URL (from Firebase Storage), return it
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a path, it might be a legacy path - return placeholder
    return this.getPlaceholderImage();
  }

  /**
   * Handle image load errors
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getPlaceholderImage();
  }

  /**
   * Get placeholder image
   */
  private getPlaceholderImage(): string {
    // You can use a default image from your assets or a placeholder service
    return 'tour-placeholder.jpg'; // or use '/placeholder.svg?height=300&width=500'
  }

  /**
   * Debug method to check tours
   */
  debugTours(): void {
    console.log('🔧 Starting tours debug...');
    this.toursService.debugPublishedTours().subscribe();
    
    // Also check what the current user tours observable has
    this.allTours$.subscribe(tours => {
      console.log('🔧 Current user tours:', tours);
    });
  }
}
