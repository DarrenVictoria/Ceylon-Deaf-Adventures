import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DestinationsService, Destination } from '../../../services/destinations.service';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-destination-detail-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule
    ],
    template: `
    <div class="page-container" *ngIf="destination$ | async as destination; else notFound">
      
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-image-wrapper">
          <img [src]="destination.image" [alt]="destination.alt" class="hero-image">
          <div class="hero-overlay"></div>
        </div>
        <div class="container hero-content">
          <div class="hero-icon-wrapper">
            <mat-icon class="hero-icon">{{ destination.icon }}</mat-icon>
          </div>
          <h1>{{ destination.title }}</h1>
          <p class="hero-subtitle">{{ destination.description }}</p>
          <div class="photo-credit">Photo: {{ destination.credit }}</div>
        </div>
      </section>

      <div class="container content-container">
        
        <!-- Main Description -->
        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>About {{ destination.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="full-description">{{ destination.fullDescription || destination.description }}</p>
          </mat-card-content>
        </mat-card>

        <!-- Highlights -->
        <div class="highlights-section" *ngIf="destination.highlights && destination.highlights.length > 0">
          <h2>Highlights</h2>
          <div class="highlights-grid">
            <mat-card *ngFor="let highlight of destination.highlights" class="highlight-card">
              <mat-card-content>
                <mat-icon color="accent">star</mat-icon>
                <span>{{ highlight }}</span>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <!-- CTA Section -->
        <section class="cta-section">
          <h2>Ready to explore {{ destination.title }}?</h2>
          <p>Find accessible tours that visit this amazing location.</p>
          <button mat-raised-button color="primary" [routerLink]="['/tours']" [queryParams]="{ search: destination.title }">
            <mat-icon>search</mat-icon>
            Find Tours to {{ destination.title }}
          </button>
        </section>

      </div>
    </div>

    <ng-template #notFound>
      <div class="not-found-container">
        <mat-icon class="error-icon">location_off</mat-icon>
        <h2>Destination Not Found</h2>
        <p>We couldn't find the destination you're looking for.</p>
        <button mat-raised-button color="primary" routerLink="/">Go Home</button>
      </div>
    </ng-template>
  `,
    styles: [`
    :host {
      display: block;
      background-color: var(--background);
      min-height: 100vh;
      padding-bottom: 80px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      height: 50vh;
      min-height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      margin-bottom: -60px; /* Overlap effect */
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
      background: rgba(0,0,0,0.5);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .hero-icon-wrapper {
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(8px);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .hero-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0;
      opacity: 0.9;
    }

    .photo-credit {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-top: 16px;
    }

    /* Content */
    .content-container {
      position: relative;
      z-index: 3;
    }

    .content-card {
      padding: 32px;
      border-radius: 24px;
      margin-bottom: 48px;
    }

    mat-card-title {
      font-size: 1.75rem;
      color: var(--primary);
      margin-bottom: 16px;
    }

    .full-description {
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-primary);
    }

    /* Highlights */
    .highlights-section {
      margin-bottom: 48px;
    }

    .highlights-section h2 {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 32px;
      color: var(--primary);
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .highlight-card {
      border-radius: 16px;
      background: var(--surface-color);
      box-shadow: none;
      border: 1px solid #e2e8f0;
      transition: transform 0.2s;
    }

    .highlight-card:hover {
      transform: translateY(-4px);
    }

    .highlight-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px !important;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* CTA */
    .cta-section {
      text-align: center;
      background: #f0fdfa;
      padding: 48px;
      border-radius: 24px;
      border: 1px solid rgba(45, 212, 191, 0.2);
    }

    .cta-section h2 {
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .cta-section p {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-bottom: 24px;
    }

    .cta-section button {
      padding: 24px 32px;
      font-size: 1.1rem;
      border-radius: 50px;
    }

    /* Not Found */
    .not-found-container {
      height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--text-muted);
    }
  `]
})
export class DestinationDetailPageComponent {
    private route = inject(ActivatedRoute);
    private destinationsService = inject(DestinationsService);

    destination$: Observable<Destination | undefined> = this.route.paramMap.pipe(
        map(params => {
            const slug = params.get('slug');
            return slug ? this.destinationsService.getDestinationBySlug(slug) : undefined;
        })
    );
}
