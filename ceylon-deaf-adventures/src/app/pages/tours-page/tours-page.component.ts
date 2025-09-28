import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { ToursService } from '../../services/tours.service';
import { Tour } from '../../models/tour';
import { Observable, combineLatest, startWith, Subject, BehaviorSubject } from 'rxjs';
import { map, takeUntil, debounceTime, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingDialogComponent } from '../../components/booking-dialog/booking-dialog.component';
import { TourDetailDialogComponent } from '../../components/tour-detail-dialog/tour-detail-dialog.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tours-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    CardComponent,
    CardContentComponent,
    ButtonComponent,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
      padding: 5rem 0;
    }
    
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      max-width: 48rem;
      margin: 0 auto;
      line-height: 1.6;
      text-align: center;
    }
    
    .filters-section {
      padding: 2rem 0;
      background: rgba(243, 244, 246, 0.5);
    }
    
    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .filter-field {
      flex: 1;
      min-width: 250px;
    }
    
    .tours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      padding: 5rem 0;
    }
    
    .tour-card {
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      background: white;
    }
    
    .tour-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .tour-image-container {
      position: relative;
      height: 16rem;
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
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
      border-radius: 1rem 1rem 0 0;
    }
    
    .tour-type-badge {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .tour-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .tour-title {
      font-weight: 700;
      font-size: 1.25rem;
      color: #1f2937;
      margin: 0;
    }
    
    .tour-description {
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
    }
    
    .tour-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #3b82f6;
      margin: 0.5rem 0;
    }
    
    .tour-buttons {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }
    
    .btn-primary {
      flex: 1;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .btn-outline {
      flex: 1;
      background: white;
      color: #3b82f6;
      border: 1px solid #3b82f6;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-outline:hover {
      background: #3b82f6;
      color: white;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 16rem;
    }
    
    .no-results {
      text-align: center;
      color: #6b7280;
      font-size: 1.125rem;
      padding: 3rem 0;
    }
    
    .accessibility-section {
      padding: 5rem 0;
      background: rgba(243, 244, 246, 0.3);
    }
    
    .accessibility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    
    .accessibility-card {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;
    }
    
    .accessibility-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .icon-container {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .icon-primary {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
    
    .icon-accent {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }
    
    .icon-secondary {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin-bottom: 1rem;
    }
    
    .section-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      text-align: center;
      margin-bottom: 4rem;
    }
    
    @media (max-width: 768px) {
      .filter-form {
        flex-direction: column;
      }
      
      .filter-field {
        min-width: 100%;
      }
      
      .tours-grid {
        grid-template-columns: 1fr;
        padding: 3rem 0;
      }
      
      .tour-buttons {
        flex-direction: column;
      }
    }
  `],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-6">
          <h1 class="hero-title">Accessible Adventures for Everyone</h1>
          <p class="hero-subtitle">
            From whale watching to cultural immersion — discover Sri Lanka barrier-free with expert visual guides and
            sign language interpretation.
          </p>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form [formGroup]="filterForm" class="filter-form">
          <mat-form-field appearance="fill" class="filter-field">
            <mat-label>Search by title or description</mat-label>
            <input matInput formControlName="searchText">
          </mat-form-field>
          <mat-form-field appearance="fill" class="filter-field">
            <mat-label>Tour Type</mat-label>
            <mat-select formControlName="selectedType">
              <mat-option value="">All Types</mat-option>
              <mat-option value="group">Group</mat-option>
              <mat-option value="private">Private</mat-option>
              <mat-option value="deaf_guide">Deaf Guide</mat-option>
              <mat-option value="adventure">Adventure</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="fill" class="filter-field">
            <mat-label>Locations (select multiple)</mat-label>
            <mat-select formControlName="selectedLocations" multiple>
              @for (loc of uniqueLocations$ | async; track loc) {
                <mat-option [value]="loc">{{ loc }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </form>
      </div>
    </section>

    <!-- Tour Cards Grid -->
    <section>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (isLoading$ | async) {
          <div class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
          </div>
        } @else {
          @if (filteredTours$ | async; as tours) {
            @if (tours.length === 0) {
              <div class="no-results">No tours found matching your criteria.</div>
            } @else {
              <div class="tours-grid">
                @for (tour of tours; track tour.id) {
                  <div class="tour-card">
                    <div class="tour-image-container">
                      <img
                        [src]="tour.images[0] || '/placeholder.svg?height=300&width=500'"
                        [alt]="tour.title"
                        class="tour-image"
                      />
                      <div class="tour-overlay"></div>
                      <div class="tour-type-badge">
                        <lucide-icon [name]="getIcon(tour.type)" [size]="20"></lucide-icon>
                        <span style="font-size: 0.875rem; font-weight: 500;">{{ tour.type | titlecase }}</span>
                      </div>
                    </div>
                    <div class="tour-content">
                      <h3 class="tour-title">{{ tour.title }}</h3>
                      <p class="tour-description">{{ tour.shortDescription }}</p>
                      <div class="tour-price"> $ {{ tour.priceDisplay }} {{ tour.currency }}</div>
                      <div class="tour-buttons">
                        <button class="btn-primary" (click)="openBookingDialog(tour)">
                          Book Now
                        </button>
                        <button class="btn-outline" (click)="openDetailDialog(tour)">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          }
        }
      </div>
    </section>

    <!-- Accessibility Highlights -->
    <section class="accessibility-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="section-title">Accessibility Highlights</h2>
          <p class="section-subtitle">
            Every tour designed with comprehensive accessibility features
          </p>
        </div>

        <div class="accessibility-grid">
          <div class="accessibility-card">
            <div class="icon-container icon-primary">
              <lucide-icon name="eye" [size]="32"></lucide-icon>
            </div>
            <h3 style="font-weight: 700; font-size: 1.125rem; color: #1f2937; margin-bottom: 1rem;">Sign Language Guides</h3>
            <p style="color: #6b7280; font-size: 0.875rem;">Certified Deaf guides and interpreters for every tour</p>
          </div>

          <div class="accessibility-card">
            <div class="icon-container icon-accent">
              <lucide-icon name="users" [size]="32"></lucide-icon>
            </div>
            <h3 style="font-weight: 700; font-size: 1.125rem; color: #1f2937; margin-bottom: 1rem;">Visual & Written Guides</h3>
            <p style="color: #6b7280; font-size: 0.875rem;">Comprehensive visual materials and written descriptions</p>
          </div>

          <div class="accessibility-card">
            <div class="icon-container icon-secondary">
              <lucide-icon name="car" [size]="32"></lucide-icon>
            </div>
            <h3 style="font-weight: 700; font-size: 1.125rem; color: #1f2937; margin-bottom: 1rem;">Accessible Transport</h3>
            <p style="color: #6b7280; font-size: 0.875rem;">Comfortable vehicles with visual communication systems</p>
          </div>

          <div class="accessibility-card">
            <div class="icon-container icon-primary">
              <lucide-icon name="home" [size]="32"></lucide-icon>
            </div>
            <h3 style="font-weight: 700; font-size: 1.125rem; color: #1f2937; margin-bottom: 1rem;">Accessible Stays</h3>
            <p style="color: #6b7280; font-size: 0.875rem;">Deaf-friendly accommodations with visual alert systems</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ToursPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading$ = new BehaviorSubject<boolean>(true);

  allTours$!: Observable<Tour[]>;
  filteredTours$!: Observable<Tour[]>;
  uniqueLocations$!: Observable<string[]>;
  filterForm!: FormGroup;

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
    // Load tours with caching
    this.allTours$ = this.toursService.listTours().pipe(
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

  getIcon(type: string): string {
    const icons = {
      adventure: 'mountain',
      group: 'users',
      private: 'home',
      deaf_guide: 'eye'
    };
    return icons[type as keyof typeof icons] || 'mountain';
  }
}