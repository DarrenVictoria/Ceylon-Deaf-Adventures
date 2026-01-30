import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Tour } from '../../../models/tour';
import { ToursService } from '../../../services/tours.service';
import { BookingDialogComponent } from '../../../components/booking-dialog/booking-dialog.component';
import { DestinationsService } from '../../../services/destinations.service';
import { Observable, switchMap, tap, map, of, catchError } from 'rxjs';

@Component({
  selector: 'app-tour-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="page-container" *ngIf="tour$ | async as tour; else loading">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-image-wrapper">
          <img [src]="tour.images[0] || '/placeholder.svg?height=600&width=1200'" [alt]="tour.title" class="hero-image">
          <div class="hero-overlay"></div>
        </div>
        <div class="container hero-content">
          <div class="hero-badges">
            <span class="hero-badge type-badge">
              <mat-icon>{{ getTypeIcon(tour.type) }}</mat-icon>
              {{ tour.type | titlecase }}
            </span>
            <span class="hero-badge duration-badge">
              <mat-icon>schedule</mat-icon>
              {{ tour.durationDays }} Days / {{ tour.durationNights || (tour.durationDays > 1 ? tour.durationDays - 1 : 0) }} Nights
            </span>
          </div>
          <h1>{{ tour.title }}</h1>
          <p class="hero-subtitle">{{ tour.shortDescription }}</p>
        </div>
      </section>

      <div class="container main-content-grid">
        <!-- Left Column: Details -->
        <div class="details-column">
          
          <!-- About -->
          <section class="content-block">
            <h2><mat-icon>description</mat-icon> About This Tour</h2>
            <p class="description-text">{{ tour.fullDescription }}</p>
          </section>

          <mat-divider></mat-divider>

          <!-- Highlights -->
          <section class="content-block">
            <h2><mat-icon>star</mat-icon> Tour Highlights</h2>
            <div class="highlights-grid">
              <div class="highlight-item" *ngFor="let feature of tour.features">
                <mat-icon class="check-icon">check_circle</mat-icon>
                <span>{{ feature }}</span>
              </div>
            </div>
          </section>

          <mat-divider></mat-divider>

          <!-- Accessibility -->
          <section class="content-block">
            <h2><mat-icon>accessible</mat-icon> Accessibility Features</h2>
            <div class="accessibility-grid">
              
              <div class="accessibility-card" *ngIf="tour.accessibility.visualAlarms === 'available' || tour.accessibility.visualAlarms === 'limited'">
                <div class="access-header">
                  <mat-icon [class.success]="tour.accessibility.visualAlarms === 'available'" 
                            [class.limited]="tour.accessibility.visualAlarms === 'limited'">
                    {{ getAccessIcon(tour.accessibility.visualAlarms) }}
                  </mat-icon>
                  <div>
                      <span class="access-title block font-semibold mb-2">Visual Alarms</span>
                      <span class="access-status-badge"
                            [class.available]="tour.accessibility.visualAlarms === 'available'"
                            [class.limited]="tour.accessibility.visualAlarms === 'limited'">
                          {{ tour.accessibility.visualAlarms | titlecase }}
                      </span>
                  </div>
                </div>
              </div>

              <div class="accessibility-card" *ngIf="tour.accessibility.staffTrained === 'available' || tour.accessibility.staffTrained === 'limited'">
                <div class="access-header">
                  <mat-icon [class.success]="tour.accessibility.staffTrained === 'available'"
                            [class.limited]="tour.accessibility.staffTrained === 'limited'">
                    {{ getAccessIcon(tour.accessibility.staffTrained) }}
                  </mat-icon>
                  <div>
                      <span class="access-title block font-semibold mb-2">Trained Staff</span>
                      <span class="access-status-badge"
                            [class.available]="tour.accessibility.staffTrained === 'available'"
                            [class.limited]="tour.accessibility.staffTrained === 'limited'">
                          {{ tour.accessibility.staffTrained | titlecase }}
                      </span>
                  </div>
                </div>
              </div>

              <div class="accessibility-card" *ngIf="tour.accessibility.ramps === 'available' || tour.accessibility.ramps === 'limited'">
                <div class="access-header">
                  <mat-icon [class.success]="tour.accessibility.ramps === 'available'"
                            [class.limited]="tour.accessibility.ramps === 'limited'">
                    {{ getAccessIcon(tour.accessibility.ramps) }}
                  </mat-icon>
                  <div>
                      <span class="access-title block font-semibold mb-2">Wheelchair Ramps</span>
                      <span class="access-status-badge"
                            [class.available]="tour.accessibility.ramps === 'available'"
                            [class.limited]="tour.accessibility.ramps === 'limited'">
                          {{ tour.accessibility.ramps | titlecase }}
                      </span>
                  </div>
                </div>
              </div>

              <div class="accessibility-card" *ngIf="tour.accessibility.captionsProvided === 'available' || tour.accessibility.captionsProvided === 'limited'">
                <div class="access-header">
                  <mat-icon [class.success]="tour.accessibility.captionsProvided === 'available'"
                            [class.limited]="tour.accessibility.captionsProvided === 'limited'">
                    {{ getAccessIcon(tour.accessibility.captionsProvided) }}
                  </mat-icon>
                  <div>
                      <span class="access-title block font-semibold mb-2">Captions</span>
                      <span class="access-status-badge" 
                            [class.available]="tour.accessibility.captionsProvided === 'available'"
                            [class.limited]="tour.accessibility.captionsProvided === 'limited'">
                          {{ tour.accessibility.captionsProvided | titlecase }}
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <mat-divider></mat-divider>

          <!-- Destinations -->
           <section class="content-block">
             <h2><mat-icon>place</mat-icon> Destinations</h2>
             
             <div class="rich-destinations-grid">
               <div class="destination-card no-image" *ngFor="let dest of getRichDestinations(tour.location)">
                  <div class="dest-info">
                      <div class="dest-header">
                        <mat-icon>place</mat-icon>
                        <h3>{{ dest.title }}</h3>
                      </div>
                  </div>
               </div>
             </div>
           </section>

        </div>

        <!-- Right Column: Booking & Actions -->
        <div class="sidebar-column">
          <div class="booking-card-wrapper">
            <mat-card class="booking-card">
              <mat-card-content>
                <div class="price-header">
                  <ng-container *ngIf="tour.isNegotiable || tour.priceDisplay === 0; else fixedPrice">
                     <span class="negotiable-text">Price Negotiable</span>
                     <span class="negotiable-sub">Make an offer</span>
                  </ng-container>
                  <ng-template #fixedPrice>
                      <span class="currency">{{ tour.currency }}</span>
                      <span class="amount">{{ tour.priceDisplay }}</span>
                      <span class="per-person">/ person</span>
                  </ng-template>
                </div>

                <div class="info-rows">
                  <div class="info-row">
                    <mat-icon>phone</mat-icon>
                    <span><strong>+94 765535051</strong></span>
                  </div>
                  <div class="info-row">
                    <mat-icon>group</mat-icon>
                    <span>Max Group Size: <strong>{{ tour.capacity }}</strong></span>
                  </div>
                  <div class="info-row">
                    <mat-icon>calendar_today</mat-icon>
                    <span>Next Available: <strong>{{ getNextAvailableDate(tour) }}</strong></span>
                  </div>
                </div>

                <div class="action-buttons">
                  <button mat-raised-button color="primary" class="book-btn" (click)="openBookingDialog(tour)">
                    <mat-icon>event</mat-icon>
                    {{ (tour.isNegotiable || tour.priceDisplay === 0) ? 'Make an Offer' : 'Book This Tour' }}
                  </button>
                  
                  <button mat-stroked-button class="print-btn" (click)="printItinerary()">
                    <mat-icon>print</mat-icon>
                    Print Itinerary
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading tour details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      background-color: var(--background);
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      height: 60vh;
      min-height: 400px;
      display: flex;
      align-items: flex-end;
      color: white;
      margin-bottom: 48px;
    }

    .hero-image-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8));
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding-bottom: 64px;
      width: 100%;
    }

    .hero-badges {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .hero-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(8px);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      border: 1px solid rgba(255,255,255,0.3);
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0 0 16px 0;
      line-height: 1.1;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      max-width: 800px;
      opacity: 0.9;
    }

    /* Main Content Grid */
    .main-content-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 48px;
      padding-bottom: 80px;
    }

    @media (max-width: 900px) {
      .main-content-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Content Blocks */
    .content-block {
      margin-bottom: 40px;
    }

    .content-block h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.75rem;
      color: var(--primary);
      margin-bottom: 24px;
    }

    .description-text {
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-primary);
      white-space: pre-line;
    }

    /* Highlights Grid */
    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .highlight-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--surface-color);
      border-radius: 12px;
    }

    .check-icon {
      color: var(--success-color);
    }

    /* Accessibility */
    .accessibility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }
    
    .accessibility-card {
        background: #f8fafc;
        padding: 16px;
        border-radius: 12px;
    }

    .access-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .access-header mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
    }

    .access-header mat-icon.success {
      color: #10B981; /* Green */
    }

    .access-header mat-icon.limited {
      color: #F59E0B; /* Amber/Orange */
    }
    
    /* Default/Unavailable icon color */
    .access-header mat-icon:not(.success):not(.limited) {
      color: #EF4444; /* Red */
      opacity: 0.5;
    }

    .access-title {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .access-status {
        display: block;
        font-size: 0.8rem;
        color: #6b7280;
    }

    .access-status-badge {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .access-status-badge.available {
        background-color: #d1fae5;
        color: #065f46;
    }
    
    .access-status-badge.limited {
        background-color: #fef3c7;
        color: #92400e;
    }

    /* Sidebar / Booking Card */
    .booking-card-wrapper {
      position: sticky;
      top: 100px;
    }

    .booking-card {
      border-radius: 24px !important;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
    }

    .price-header {
      text-align: center;
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }

    .negotiable-text {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 4px;
    }
    
    .negotiable-sub {
        display: block;
        font-size: 0.9rem;
        color: var(--accent-color);
        font-weight: 500;
    }

    .currency {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-secondary);
      vertical-align: top;
      margin-right: 4px;
    }

    .amount {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }

    .per-person {
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .info-rows {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-secondary);
    }

    .info-row mat-icon {
      color: var(--primary);
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .book-btn {
      padding: 24px !important;
      font-size: 1.1rem !important;
      border-radius: 12px !important;
    }

    .print-btn {
      padding: 24px !important;
      border-radius: 12px !important;
    }

    .loading-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    
    .rich-destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .destination-card {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
        background: #f9fafb;
        transition: transform 0.2s;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .destination-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background: white;
        border-color: var(--primary-light);
    }
    
    .dest-info {
        padding: 16px;
    }
    
    .dest-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .dest-header mat-icon {
      color: var(--accent-color);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .dest-info h3 {
        font-size: 1.05rem;
        font-weight: 600;
        margin: 0;
        color: var(--primary-color);
    }
    
    .dest-info p {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
    }

    /* Print Styles */
    @media print {
        .hero-section {
            height: 300px !important;
            margin-bottom: 20px !important;
            page-break-after: avoid;
        }
        
        .hero-overlay {
            background: none !important; /* Save ink */
        }
        
        .hero-content {
            color: black !important;
            text-shadow: none !important;
        }
        
        h1 {
            color: #FFFF00 !important; /* Brightest Yellow for PDF contrast */
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important; /* Add shadow to ensure pop against bg */
        }
        
        .hero-subtitle {
             color: #FFFF00 !important;
             text-shadow: 1px 1px 3px rgba(0,0,0,0.8) !important;
             opacity: 1 !important;
        }
        
        .sidebar-column, .action-buttons, mat-icon {
            display: none !important;
        }
        
        .main-content-grid {
            display: block !important;
        }
        
        /* Ensure specific sections utilize full width */
        .details-column {
            width: 100% !important;
        }
        
        /* Force background cleaning for readability if user enables background graphics */
        body {
            background: white !important;
            color: black !important;
        }
    }
  `]
})
export class TourDetailPageComponent implements OnInit {
  tour$: Observable<Tour | undefined>;
  dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private toursService: ToursService,
    private destinationsService: DestinationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tour$ = this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        if (slug) {
          // Assuming listTours is cached or fast enough. Ideally we'd have getTourBySlug
          return this.toursService.listTours().pipe(
            map(tours => tours.find(t => t.slug === slug))
          );
        }
        return of(undefined);
      })
    );
  }

  getRichDestinations(locations: string[]): any[] {
    const allDestinations = this.destinationsService.getDestinations();
    return locations.map(locName => {
      // Try exact match or partial match to find a description
      const match = allDestinations.find(d => d.title.toLowerCase() === locName.toLowerCase() ||
        d.title.toLowerCase().includes(locName.toLowerCase()) ||
        locName.toLowerCase().includes(d.title.toLowerCase()));

      return {
        title: locName, // ALWAYS use the exact name from the DB (input)
        // Use the matched description if available, otherwise strict fallback (or empty if you prefer)
        // User said "do not add or change" - assuming they still want the rich description if it's relevant, 
        // but if they mean literally "ONLY what I entered", then I should remove description too?
        // Context from prev turn: "show the destination as enterered properly"
        // I will keep the description if found, as that was the "rich" part, but ensure Title is exact.
        description: match ? match.description : ''
      };
    });
  }

  getPlaceholderImage(name: string): string {
    // Simple fallback logic
    return '/assets/images/placeholder-destination.jpg';
  }

  ngOnInit() {
    // Scroll to top on init
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'group': return 'groups';
      case 'private': return 'person';
      case 'deaf_guide': return 'hearing_disabled';
      case 'adventure': return 'hiking';
      default: return 'tour';
    }
  }

  getNextAvailableDate(tour: Tour): string {
    if (tour.nextAvailableDates && tour.nextAvailableDates.length > 0) {
      // Handle Firestore Timestamp
      const date = tour.nextAvailableDates[0] instanceof Date
        ? tour.nextAvailableDates[0]
        : (tour.nextAvailableDates[0] as any).toDate();

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return 'On Request';
  }

  getAccessIcon(status: string): string {
    switch (status) {
      case 'available': return 'check_circle';
      case 'limited': return 'warning';
      case 'unavailable': return 'cancel';
      default: return 'help';
    }
  }

  openBookingDialog(tour: Tour) {
    this.dialog.open(BookingDialogComponent, {
      width: '600px',
      data: { tour },
      autoFocus: false
    });
  }

  printItinerary() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }
}
