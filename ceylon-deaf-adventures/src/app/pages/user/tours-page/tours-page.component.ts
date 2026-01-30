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
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, startWith, takeUntil, debounceTime, distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingDialogComponent } from '../../../components/booking-dialog/booking-dialog.component';
import { TourDetailDialogComponent } from '../../../components/tour-detail-dialog/tour-detail-dialog.component';

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
    ReactiveFormsModule,
    RouterLink
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
              From whale watching to cultural immersion — discover Sri Lanka barrier-free with expert visual guides and sign language interpretation.
            </p>
            
            <div class="hero-stats">
              <div class="stat-item">
                <mat-icon class="stat-icon">tour</mat-icon>
                <ng-container *ngIf="tourCount$ | async as count; else loadingCount">
                  <span class="stat-number">{{ count }}</span>
                </ng-container>
                <ng-template #loadingCount>
                  <span class="stat-number loading-skeleton">-</span>
                </ng-template>
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
              <mat-form-field class="filter-field" appearance="outline">
                <mat-label>Search tours...</mat-label>
                <input matInput formControlName="searchText" placeholder="Enter destination or activity">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field class="filter-field" appearance="outline">
                <mat-label>Tour Type</mat-label>
                <mat-select formControlName="selectedType">
                  <mat-option value="">All Types</mat-option>
                  <mat-option value="group">
                    <mat-icon>groups</mat-icon> Group Tours
                  </mat-option>
                  <mat-option value="private">
                    <mat-icon>person</mat-icon> Private Tours
                  </mat-option>
                  <mat-option value="deaf_guide">
                    <mat-icon>accessibility</mat-icon> Deaf Guide Tours
                  </mat-option>
                  <mat-option value="adventure">
                    <mat-icon>hiking</mat-icon> Adventure Tours
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="filter-field" appearance="outline">
                <mat-label>Locations</mat-label>
                <mat-select formControlName="selectedLocations" multiple>
                  <mat-option *ngFor="let loc of uniqueLocations$ | async" [value]="loc">
                    {{ loc }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <button mat-flat-button color="primary" class="clear-filters-btn" (click)="clearFilters()" [disabled]="!filterForm.dirty">
                Clear Filters
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </section>

    <!-- Tours Section -->
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
          <mat-card *ngFor="let tour of filteredTours$ | async; trackBy: trackByTourId" class="tour-card" matRipple>
            <!-- Tour Image -->
            <div class="tour-image-container">
              <img [src]="getImageUrl(tour.images[0])" [alt]="tour.title" class="tour-image" (error)="onImageError($event)" />
              <div class="tour-overlay">
                <div class="tour-badges-top">
                    <span class="tour-type-badge">
                        <mat-icon class="badge-icon">{{ getTypeIcon(tour.type) }}</mat-icon>
                        {{ tour.type | titlecase }}
                    </span>
                </div>
                <div class="tour-badges-bottom">
                    <span class="tour-duration-badge">
                        <mat-icon class="badge-icon">schedule</mat-icon>
                        {{ tour.durationDays }} Days / {{ tour.durationNights || (tour.durationDays > 1 ? tour.durationDays - 1 : 0) }} Nights
                    </span>
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

              <!-- Card Action Footer -->
              <div class="card-footer">
                <div class="price-info">
                  <span class="price-label">From</span>
                  <span class="price-value" *ngIf="!tour.isNegotiable && tour.priceDisplay > 0">
                      {{ tour.currency }} {{ tour.priceDisplay }}
                  </span>
                  <span class="price-value negotiable" *ngIf="tour.isNegotiable || tour.priceDisplay === 0">
                      Negotiable
                  </span>
                </div>
                <div class="card-actions">
                  <a [routerLink]="['/tours', tour.slug]" class="btn-details">
                    Details
                  </a>
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
    /* Global Variables - Scoped to Component */
    :host {
      --primary-color: #0b1f3a;
      --primary-light: #1e3a5f;
      --accent-color: #f4b416;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --surface-color: #f8fafc;
      --success-color: #10b981;
      display: block;
      background-color: #f3f4f6;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      background-color: var(--primary-color);
      color: white;
      padding: 80px 0 120px;
      overflow: hidden;
      margin-bottom: -60px; /* Overlap with filters */
      text-align: center;
    }
    
    .hero-background {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, var(--primary-color) 0%, #112e52 100%);
      opacity: 0.9;
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 10;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 24px;
      line-height: 1.2;
    }

    .highlight-text {
      color: var(--accent-color);
    }

    .hero-description {
        font-size: 1.25rem;
        max-width: 700px;
        margin: 0 auto 48px;
        opacity: 0.9;
        line-height: 1.6;
    }

    .hero-stats {
        display: flex;
        justify-content: center;
        gap: 60px;
        flex-wrap: wrap;
    }
    
    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }
    
    .stat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--accent-color);
        margin-bottom: 8px;
    }
    
    .stat-number {
        font-size: 1.75rem;
        font-weight: 700;
        color: white;
    }
    
    .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
        font-weight: 500;
    }

    /* Filter Section */
    .filters-section {
        position: relative;
        z-index: 20;
        margin-bottom: 48px;
    }
    
    .filter-card {
        border-radius: 16px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .filter-content {
        padding: 32px;
    }
    
    .filter-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .filter-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        align-items: flex-start;
    }
    
    .clear-filters-btn {
        height: 56px;
        margin-top: 4px; 
    }

    /* Tours Grid */
    .tours-section {
        padding-bottom: 80px;
    }
    
    .tours-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 32px;
    }
    
    .tour-card {
        border-radius: 16px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: none;
        background: white;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .tour-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .tour-image-container {
        height: 240px;
        position: relative;
        overflow: hidden;
    }
    
    .tour-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .tour-card:hover .tour-image {
        transform: scale(1.05);
    }
    
    .tour-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%);
        pointer-events: none;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .card-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn-details {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 24px;
      background-color: var(--primary-color);
      color: white;
      text-decoration: none;
      font-weight: 600;
      border-radius: 4px;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }

    .btn-details:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(11, 31, 58, 0.2);
    }
    
    .tour-type-badge {
        background: rgba(11, 31, 58, 0.85);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .tour-badges-bottom {
        display: flex;
        justify-content: flex-start;
    }

    .tour-duration-badge {
         color: white;
         font-size: 0.85rem;
         font-weight: 500;
         display: flex;
         align-items: center;
         gap: 6px;
         text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }

    .tour-content {
        padding: 24px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    
    .tour-header {
        margin-bottom: 12px;
    }
    
    .price-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .price-value.negotiable {
        font-size: 1.1rem;
        color: var(--accent-color);
        font-style: italic;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #f1f5f9;
        gap: 16px;
    }
    
    .tour-locations {
        margin-bottom: 12px;
    }
    
    .location-chip {
        /* Ensuring ViewEncapsulation doesn't break style binding for chips if deeply nested */
        font-size: 0.75rem !important;
        background-color: #f1f5f9 !important;
    }

    .tour-description {
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .tour-features {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: auto;
    }
    
    .feature-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        color: var(--primary-light);
        background: #e0f2fe;
        padding: 4px 10px;
        border-radius: 6px;
    }
    
    .feature-icon {
        font-size: 16px;
        width: 16px;
        height: 16px; 
    }
    
    .content-divider {
        margin: 20px 0;
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
        font-weight: 800;
        color: var(--primary-color);
        line-height: 1;
    }
    
    .price-per {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .tour-actions {
        display: flex;
        gap: 8px;
    }
    
    .action-btn {
        border-radius: 8px;
    }
    
    /* Accessibility Section */
    .accessibility-section {
        background: white;
        padding: 100px 0;
    }
    
    .section-header {
        text-align: center;
        margin-bottom: 60px;
    }
    
    .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--primary-color);
        margin-bottom: 16px;
    }
    
    .section-subtitle {
        font-size: 1.25rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
    }
    
    .accessibility-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 32px;
    }
    
    .accessibility-card {
        text-align: center;
        height: 100%;
        border-radius: 16px;
        background: #f8fafc;
        box-shadow: none;
        border: 1px solid #e2e8f0;
        transition: transform 0.3s ease;
    }
    
    .accessibility-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    }
    
    .accessibility-content {
        padding: 40px;
    }
    
    .accessibility-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
        color: white;
    }
    
    .primary-gradient { background: linear-gradient(135deg, #0b1f3a, #1e3a5f); }
    .accent-gradient { background: linear-gradient(135deg, #f4b416, #fbbf24); }
    .success-gradient { background: linear-gradient(135deg, #10b981, #34d399); }
    
    .accessibility-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--primary-color);
    }
    
    .accessibility-description {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 768px) {
        .hero-title { font-size: 2.25rem; }
        .hero-stats { gap: 32px; }
        .tours-grid { grid-template-columns: 1fr; }
        .tour-footer { flex-direction: column; align-items: stretch; text-align: center; }
        .tour-actions { justify-content: center; margin-top: 12px; }
        .pricing-info { align-items: center; }
    }
  `]
})
export class ToursPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading$ = new BehaviorSubject<boolean>(true);
  tourCount$ = new BehaviorSubject<number | null>(null);

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
      selectedLocations: [[]],
    });

    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filterTours();
    });
  }

  private loadTours() {
    this.isLoading$.next(true);

    this.allTours$ = this.toursService.listTours().pipe(
      tap(tours => {
        this.isLoading$.next(false);
        this.tourCount$.next(tours.length);
      }),
      shareReplay(1)
    );

    this.uniqueLocations$ = this.allTours$.pipe(
      map(tours => {
        const locations = new Set<string>();
        tours.forEach(tour => tour.location.forEach(loc => locations.add(loc)));
        return Array.from(locations).sort();
      })
    );

    // Initial filter setup
    this.filteredTours$ = combineLatest([
      this.allTours$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([tours, filters]) => this.applyFilters(tours, filters))
    );
  }

  private filterTours() {
    // Triggered by valueChanges, observable chain handles it
  }

  private applyFilters(tours: Tour[], filters: any): Tour[] {
    return tours.filter(tour => {
      // Search filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesTitle = tour.title.toLowerCase().includes(searchLower);
        const matchesDesc = tour.shortDescription.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      // Type filter
      if (filters.selectedType && tour.type !== filters.selectedType) {
        return false;
      }

      // Location filter
      if (filters.selectedLocations && filters.selectedLocations.length > 0) {
        const hasLocation = tour.location.some(location =>
          filters.selectedLocations.includes(location)
        );
        if (!hasLocation) return false;
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
    const icons: { [key: string]: string } = {
      adventure: 'hiking',
      group: 'groups',
      private: 'person',
      deaf_guide: 'accessibility'
    };
    return icons[type] || 'tour';
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return this.getPlaceholderImage();
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return this.getPlaceholderImage();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getPlaceholderImage();
  }

  private getPlaceholderImage(): string {
    return 'tour-placeholder.jpg';
  }
}
