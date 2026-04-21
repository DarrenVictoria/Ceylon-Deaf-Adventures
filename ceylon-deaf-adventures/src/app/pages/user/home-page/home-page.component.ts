import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { ToursService } from '../../../services/tours.service';
import { BlogsService } from '../../../services/blogs.service';
import { DestinationsService } from '../../../services/destinations.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatRippleModule,
    MatBadgeModule,
    MatChipsModule
  ],
  template: `
    <!-- Development Notice Modal -->
      <!--<div 
      *ngIf="showShopLaunch" 
      class="modal-overlay"
      (click)="closeShopLaunch()"
    >
      <mat-card class="modal-card shop-launch-card" (click)="$event.stopPropagation()">
        <button 
          mat-icon-button 
          (click)="closeShopLaunch()"
          class="close-button"
        >
          <mat-icon>close</mat-icon>
        </button>
        <mat-card-content class="shop-launch-content">
          <img 
            src="/Shops_Coming.jpeg" 
            alt="Shop Launching on November 1st, 2025"
            class="launch-image"
          />
        </mat-card-content>
      </mat-card>
    </div>-->

    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-text">
              <h1 class="hero-title">
                The Home of 
                <span class="highlight-text">Deaf-Friendly Tourism</span> 
                in Sri Lanka
              </h1>
              <p class="hero-description">
                Paradise for All Senses. Accessible adventures for the global Deaf community and their families.
              </p>
              <div class="hero-actions">
                <button 
                  mat-raised-button 
                  color="primary" 
                  size="large"
                  class="cta-button"
                  [routerLink]="['/tours']"
                  style="text-decoration: none; color: orange;"
                >
                  <mat-icon>explore</mat-icon>
                  See Our Tours
                </button>
                <button 
                  mat-stroked-button 
                  class="secondary-button"
                  [routerLink]="['/about']"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div class="hero-image">
              <div class="video-container">
                <img
                  src="/HomepageVideo.webp"
                  alt="Welcome to Deaf-friendly tourism in Sri Lanka"
                  class="welcome-video-canvas"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- About Highlight Section -->
    <section class="about-highlight-section">
      <div class="container">
        <div class="highlight-grid">
          <!-- Image Column -->
          <div class="highlight-image-col">
            <div class="image-wrapper">
              <img src="/ayubowan-srilanka.jpg" alt="Ayubowan Sri Lanka" class="highlight-image" />
              <div class="image-shape"></div>
            </div>
          </div>
          
          <!-- Content Column -->
          <div class="highlight-content-col">
            <h2>We Create Unforgettable, <span class="text-primary">Barrier-Free Journeys</span></h2>
            <p class="highlight-subtext">Experience Sri Lanka through adventures designed by and for the Deaf community.</p>
            
            <ul class="highlight-list">
              <li>
                <div class="list-icon primary-gradient">
                  <mat-icon>accessible_forward</mat-icon>
                </div>
                <div class="list-content">
                  <h3>1st Deaf-Friendly Provider</h3>
                  <p>Sri Lanka's pioneering accessible tourism company.</p>
                </div>
              </li>
              <li>
                <div class="list-icon accent-gradient">
                  <mat-icon>hearing_disabled</mat-icon>
                </div>
                <div class="list-content">
                  <h3>Qualified Deaf Guides</h3>
                  <p>Expert guidance and storytelling in Sign Language.</p>
                </div>
              </li>
              <li>
                <div class="list-icon secondary-gradient">
                  <mat-icon>explore</mat-icon>
                </div>
                <div class="list-content">
                  <h3>Tailored Adventures</h3>
                  <p>Custom itineraries crafted for every traveler's needs.</p>
                </div>
              </li>
            </ul>

            <a [routerLink]="['/about']" class="btn btn-primary mt-8">
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>


    <!-- Popular Tours Section -->
    <section class="popular-tours-section" *ngIf="popularTours.length > 0">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Popular Tours</p>
          <h2>Top Picks for the <span class="text-primary">Ultimate Journey</span></h2>
          <div class="header-decoration">
            <!-- Optional creative elements like the plane/tent doodles in the reference -->
             <mat-icon class="doodle-icon plane">flight_takeoff</mat-icon>
          </div>
        </div>

        <div class="popular-tours-scroll-wrapper">
          <div class="popular-tours-track">
            
            <div class="popular-tour-card" *ngFor="let tour of popularTours" [routerLink]="['/tours', tour.slug]">
              <div class="tour-image-box">
                <img [src]="tour.images[0]" [alt]="tour.title" loading="lazy">
                <div class="badges-container">
                  <span class="badge feature-badge">Popular</span>
                  <!-- <span class="badge discount-badge">28% Off</span> -->
                </div>
                <div class="duration-badge">
                  {{ tour.durationDays }} Days / {{ tour.durationNights || (tour.durationDays > 1 ? tour.durationDays - 1 : 0) }} Nights
                </div>
              </div>

              <div class="tour-content">
                <!-- <div class="rating-row">
                  <div class="stars">
                    <mat-icon *ngFor="let i of [1,2,3,4,5]" class="star-icon">star</mat-icon>
                  </div>
                  <span class="rating-text">{{ tour.rating }} ({{ tour.reviewCount }} reviews)</span>
                </div> -->

                <h3>{{ tour.title }}</h3>
                <div class="location-row">
                  <mat-icon>location_on</mat-icon>
                  <span>{{ tour.location[0] }}</span> 
                  <span *ngIf="tour.location.length > 1">+{{ tour.location.length - 1 }} more</span>
                </div>

                <p class="tour-excerpt">{{ tour.shortDescription | slice:0:100 }}...</p>

                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Price</span>
                    <span class="value" *ngIf="!tour.isNegotiable && tour.priceDisplay > 0">\${{ tour.priceDisplay }}</span>
                    <span class="value negotiable-price" *ngIf="tour.isNegotiable || tour.priceDisplay === 0">Negotiable</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Days</span>
                    <span class="value">{{ tour.durationDays }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Guest</span>
                    <span class="value">{{ tour.capacity }}</span>
                  </div>
                </div>

                <div class="action-row">
                  <button mat-flat-button color="primary" class="book-btn" [routerLink]="['/tours', tour.slug]">
                    Book Now
                    <mat-icon iconPositionEnd>arrow_forward</mat-icon>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- Featured Destinations -->
    <section class="destinations-section" style="padding:4rem;">
      <div class="container">
        <div class="section-header">
          <h2>Featured Destinations</h2>
          <p class="section-subtitle">
            Discover Sri Lanka's most breathtaking destinations with full accessibility
          </p>
        </div>

        <div class="destinations-grid">
          <mat-card 
            class="destination-card" 
            *ngFor="let destination of destinations.slice(0, 8)"
            matRipple
          >
            <div class="destination-image-container">
              <img 
                [src]="destination.image" 
                [alt]="destination.alt"
                class="destination-image"
              />
              <div class="image-overlay">
                <mat-icon class="destination-icon">{{ destination.icon }}</mat-icon>
              </div>
              <div class="photo-credit">{{ destination.credit }}</div>
            </div>
            <mat-card-content class="destination-content">
              <mat-card-title class="destination-title">
                {{ destination.title }}
              </mat-card-title>
              <p class="destination-description">{{ destination.description }}</p>
              <button 
                mat-button 
                color="primary" 
                class="learn-more-btn"
                [routerLink]="['/destinations', destination.slug]"
              >
                Learn More
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="section-cta">
          <button 
            mat-raised-button 
            color="accent" 
            size="large"
            [routerLink]="['/tours']"
          >
            <mat-icon>map</mat-icon>
            View All Tours
          </button>
        </div>
      </div>
    </section>



    <!-- Testimonials -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>What Our Guests Say</h2>
          <p class="section-subtitle">
            Hear from the global Deaf and hearing guest community about their Sri Lankan adventures
          </p>
        </div>

        <div class="testimonials-grid">
          <mat-card 
            class="testimonial-card" 
            *ngFor="let testimonial of testimonials"
            matRipple
          >
            <mat-card-content class="testimonial-content">
              <div class="testimonial-avatar">
                <img 
                  [src]="testimonial.image" 
                  [alt]="testimonial.name"
                  class="avatar-image"
                />
              </div>
              <blockquote class="testimonial-quote">
                <mat-icon class="quote-icon">format_quote</mat-icon>
                {{ testimonial.quote }}
              </blockquote>
              <div class="testimonial-author">
                <strong>{{ testimonial.name }}</strong>
                <span class="testimonial-location">{{ testimonial.location }}</span>
              </div>
              <div class="testimonial-rating">
                <mat-icon *ngFor="let star of [1,2,3,4,5]" class="star-icon">star</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>




    <!-- Blog Section -->
    <section class="blog-section" *ngIf="latestBlogs.length > 0">
      <div class="container">
        <div class="section-header">
          <p class="section-tag" style="text-align: center;">Latest Blog & News</p>
          <h2>Latest News & Articles from the <br><span class="text-primary">Blog Posts</span></h2>
        </div>

        <div class="blog-grid">
          <div class="blog-card" *ngFor="let blog of latestBlogs">
            <div class="blog-image-container">
              <img [src]="blog.featuredImage || '/c1.JPG'" [alt]="blog.title" class="blog-image">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span class="blog-date">
                  <mat-icon>calendar_today</mat-icon>
                  {{ blog.createdAt?.toDate() | date:'d MMMM y' }}
                </span>
                <span class="blog-comments">
                  <mat-icon>chat_bubble_outline</mat-icon>
                  Comments ({{ blog.commentCount }})
                </span>
              </div>
              
              <h3 class="blog-title">{{ blog.title }}</h3>
              <p class="blog-excerpt">{{ blog.excerpt }}</p>
              
              <div class="blog-footer">
                <div class="blog-author">
                  <img [src]="blog.authorPhoto || '/assets/avatar-placeholder.png'" class="author-avatar" onError="this.src='https://ui-avatars.com/api/?name=Admin'">
                  <span class="author-name">{{ blog.authorName || 'Admin' }}</span>
                </div>
                <button mat-button class="read-more-btn" [routerLink]="['/blogs', blog.slug]">
                  Read More
                  <mat-icon iconPositionEnd>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Carousel Section -->
    <!-- Image Carousel Section (Commented out)
    <section class="gallery-section">
      <div class="container">
        <div class="section-header">
          <h2>Adventure Gallery</h2>
          <p class="section-subtitle">Glimpses of the unforgettable moments awaiting you</p>
        </div>
        
        <div class="slider-wrapper">
          <button mat-icon-button class="nav-btn prev" (click)="prevSlide()">
            <mat-icon>chevron_left</mat-icon>
          </button>
          
          <div class="single-slide-container">
            <div class="slide-content">
              <img [src]="slides[currentSlide].image" [alt]="slides[currentSlide].alt" loading="lazy">
              <div class="carousel-caption">{{ slides[currentSlide].caption }}</div>
            </div>
            
            <div class="slide-indicators">
              <span 
                *ngFor="let slide of slides; let i = index" 
                class="indicator-dot"
                [class.active]="i === currentSlide"
                (click)="setSlide(i)"
              ></span>
            </div>
          </div>

          <button mat-icon-button class="nav-btn next" (click)="nextSlide()">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>
    </section>
    -->

    <!-- Video Section -->
    <!-- Video Section (Commented out)
    <section class="video-section">
      <div class="container">
        <div class="section-header">
          <h2>A beautiful review from our guest from China 🇨🇳🤍</h2>
          <p class="section-subtitle">
            This is what inclusive, deaf-friendly tourism in Sri Lanka looks like.
            <br>
            Sign language connects cultures. Travel creates opportunities.
          </p>
        </div>
        <div class="video-wrapper">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/JtyqnuHbedY" 
            title="Guest Review from China" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
    -->
  `,
  styles: [`
    /* Global Variables */
    mat-icon {
      font-size: 20px !important;
    }
    :host {
      --primary-color: #0b1f3a;
      --primary-light: #1e3a5f;
      --primary-dark: #061121;
      --accent-color: #f4b416;
      --accent-light: #fcd34d;
      --secondary-color: #475569;
      --success-color: #10b981;
      --background-color: #ffffff;
      --surface-color: #f8fafc;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      display: block;
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
      width: 100%;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-card {
      max-width: 500px;
      width: 100%;
      animation: slideUp 0.3s ease-out;
      background-color: #ffffff;
      border-radius: 12px;
    }

    .launch-image {
      max-width: 22rem;
      width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 8px;
    }

    @media (min-width: 1024px) {
      .launch-image {
        max-width: 30rem;
      }
    }

    .development-notice-header {
      position: relative;
      padding-bottom: 8px;
    }

    .notice-avatar {
      background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notice-icon {
      color: white;
      font-size: 24px;
    }

    .close-button {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .notice-content p {
      margin: 16px 0;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Hero Section */
    .hero-section {
      --hero-media-bottom-trim: 28px;
      --hero-media-bottom-pull: -12rem;
      position: relative;
      min-height: 100vh;
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
      background-image: url('/Main-Banner.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: brightness(0.8);
      animation: kenBurns 20s infinite alternate;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
    }

    .hero-content {
      position: relative;
      z-index: 10;
      width: 100%;
      padding: 80px 0 0;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
      align-items: flex-end;
      margin: 3rem 3rem 0;
    }

    @media (min-width: 1024px) {
      .hero-grid {
        grid-template-columns: 1fr 1fr;
        align-items: flex-end;
      }
    }

    .hero-text {
      position: relative;
      z-index: 20;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      line-height: 1.1;
      margin-bottom: 24px;
      animation: fadeInUp 1s ease-out;
    }

    @media (min-width: 1024px) {
      .hero-title {
        font-size: 4rem;
      }
    }

    .highlight-text {
      color: var(--accent-color);
      background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin-bottom: 32px;
      animation: fadeInUp 1s ease-out 0.2s both;
    }

    .hero-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: fadeInUp 1s ease-out 0.4s both;
    }

    @media (min-width: 640px) {
      .hero-actions {
        flex-direction: row;
        gap: 24px;
      }
    }

    /* Hero Media Styles */
    .hero-image {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      min-height: 360px;
      align-self: end;
      position: relative;
      z-index: 10;
      pointer-events: none;
    }

    @media (min-width: 1024px) {
      .hero-image {
        min-height: 560px;
      }
    }

    .video-container {
      position: relative;
      width: 100%;
      height: auto;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      transform: scale(1.2);
      transform-origin: bottom center;
      z-index: 10;
      pointer-events: none;
    }

    .welcome-video-canvas {
      display: block;
      width: auto;
      max-width: 100%;
      height: auto;
      max-height: 650px;
      object-fit: contain;
      object-position: bottom center;
      border-radius: 16px;
      animation: fadeInUp 1s ease-out 0.6s both;
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
      transition: transform 0.3s ease;
      margin-bottom: 0;
      clip-path: inset(0 0 var(--hero-media-bottom-trim) 0);
      margin-bottom: calc((var(--hero-media-bottom-trim) * -1) + var(--hero-media-bottom-pull));
      pointer-events: none;
    }

    .welcome-video-canvas:hover {
      transform: scale(1.02);
    }

    /* Glow effect behind video */
    .video-container::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      height: 40%;
      background: radial-gradient(ellipse at bottom, 
        rgba(45, 212, 191, 0.2) 0%, 
        transparent 70%);
      z-index: -1;
      border-radius: 50%;
      filter: blur(60px);
      animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    .cta-button {
      font-size: 1.1rem !important;
      padding: 12px 32px !important;
      height: auto !important;
      box-shadow: 0 8px 32px rgba(45, 212, 191, 0.3) !important;
      transition: all 0.3s ease !important;
    }

    .cta-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 48px rgba(45, 212, 191, 0.4) !important;
    }

    .secondary-button {
      color: white !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
      font-size: 1.1rem !important;
      padding: 12px 32px !important;
      height: auto !important;
      transition: all 0.3s ease !important;
    }

    .secondary-button:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      border-color: white !important;
    }

    /* Value Points Section */
    .value-points-section {
      padding: 80px 0;
      background: linear-gradient(135deg, var(--surface-color), white);
    }

    .value-points-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
    }

    .value-card {
      transition: all 0.3s ease;
      border-radius: 16px !important;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .value-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .value-content {
      text-align: center;
      padding: 32px 24px !important;
    }

    .value-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .value-icon mat-icon {
      font-size: 70px !important;
      width: 70px !important;
      height: 70px !important;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
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

    .info-item .value {
      font-weight: 700;
      color: var(--primary-color);
      display: block;
    }
    
    .info-item .value.negotiable-price {
        font-size: 0.9rem;
        color: var(--accent-color);
        font-style: italic;
    }

    .action-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 32px;
    }

    .value-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .value-content p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    /* About Highlight Section */
    .about-highlight-section {
      padding: 80px 0;
      background: #fff;
      overflow: hidden;
    }

    .highlight-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      align-items: center;
    }

    @media (min-width: 1024px) {
      .highlight-grid {
        grid-template-columns: 1fr 1fr;
        gap: 80px;
      }
    }

    .highlight-image-col {
      position: relative;
    }

    .image-wrapper {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      transform: rotate(-2deg);
      transition: transform 0.3s ease;
    }

    .image-wrapper:hover {
      transform: rotate(0);
    }

    .highlight-image {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s ease;
    }

    .image-wrapper:hover .highlight-image {
      transform: scale(1.05);
    }

    .highlight-content-col h2 {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .text-primary {
      color: var(--primary-color);
    }

    .highlight-subtext {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .highlight-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .highlight-list li {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .list-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: white;
    }

    .list-icon mat-icon {
      font-size: 28px !important;
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .list-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 4px;
      color: var(--text-primary);
    }

    .list-content p {
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    /* Premium Button Style */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
      padding: 16px 40px;
      border-radius: 50px;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 32px;
      box-shadow: 0 10px 20px -5px rgba(45, 212, 191, 0.4);
      border: 1px solid rgba(255,255,255,0.1);
      letter-spacing: 0.5px;
    }

    .btn-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 20px 30px -8px rgba(45, 212, 191, 0.5);
      background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
    }

    .btn-primary:active {
      transform: translateY(-1px);
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

    /* Destinations Section */
    .destinations-section {
      padding: 80px 0;
      background: linear-gradient(135deg, var(--surface-color), #f1f5f9);
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      margin-bottom: 64px;
    }

    .destination-card {
      border-radius: 16px !important;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .destination-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .destination-image-container {
      position: relative;
      height: 240px;
      overflow: hidden;
    }

    .destination-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .destination-card:hover .destination-image {
      transform: scale(1.1);
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      padding: 24px;
    }

    .destination-icon {
      color: white;
      font-size: 32px;
    }

    .photo-credit {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .destination-content {
      padding: 24px !important;
    }

    /* Booking Section */
    .booking-section {
      padding: 80px 0;
      background: white;
    }

    .calendly-container {
      max-width: 1000px;
      margin: 0 auto;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      background: white;
    }


    /* Gallery Section */
    .gallery-section {
      padding: 80px 0;
      background: var(--surface-color);
    }

    .slider-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }

    .single-slide-container {
      position: relative;
      width: 100%;
      height: 400px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      background: black;
    }

    .slide-content {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .slide-content img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .carousel-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 24px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: white;
      font-weight: 600;
      font-size: 1.5rem;
      text-align: center;
    }

    .nav-btn {
      background-color: white !important;
      color: var(--primary-color) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .slide-indicators {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
    }

    .indicator-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .indicator-dot.active {
      background-color: white;
      transform: scale(1.2);
    }


    /* Video Section */
    .video-section {
      padding: 80px 0;
      background: white;
    }

    .video-wrapper {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      height: 0;
      overflow: hidden;
      max-width: 1000px;
      margin: 0 auto;
      border-radius: 24px;
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15);
    }

    .video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }


    .destination-title {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      color: var(--text-primary) !important;
      margin-bottom: 12px !important;
    }

    .destination-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .learn-more-btn {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 8px 16px !important;
      transition: all 0.3s ease !important;
    }

    .learn-more-btn:hover {
      background-color: rgba(45, 212, 191, 0.1) !important;
    }

    .section-cta {
      text-align: center;
    }

    .section-cta button {
      font-size: 1.1rem !important;
      padding: 12px 32px !important;
      height: auto !important;
    }

    /* Testimonials Section */
    .testimonials-section {
      padding: 80px 0;
      background: white;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }

    .testimonial-card {
      border-radius: 16px !important;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12) !important;
    }

    .testimonial-content {
      padding: 32px 24px !important;
      text-align: center;
    }

    .testimonial-avatar {
      margin-bottom: 24px;
    }

    .avatar-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--primary-color);
      box-shadow: 0 8px 32px rgba(45, 212, 191, 0.2);
    }

    .testimonial-quote {
      font-style: italic;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 24px 0;
      position: relative;
      font-size: 1rem;
    }

    .quote-icon {
      color: var(--primary-color);
      opacity: 0.3;
      font-size: 48px;
      position: absolute;
      top: -20px;
      left: -10px;
    }

    .testimonial-author {
      margin-bottom: 16px;
    }

    .testimonial-author strong {
      color: var(--text-primary);
      font-size: 1.1rem;
      display: block;
      margin-bottom: 4px;
    }

    .testimonial-location {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .testimonial-rating {
      display: flex;
      justify-content: center;
      gap: 4px;
    }

    .star-icon {
      color: #fbbf24;
      font-size: 20px;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }

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

    @keyframes kenBurns {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes spin {
      to { transform: translate(-50%, 50%) rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-section {
        --hero-media-bottom-trim: 22px;
        --hero-media-bottom-pull: -6rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }
      
      .section-header h2 {
        font-size: 2rem;
      }
      
      .container {
        padding: 0 16px;
      }
      
      .destinations-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
      
      .hero-image {
        min-height: 280px;
      }

      .video-container {
        transform: scale(1.08);
      }
      
      .welcome-video-canvas {
        max-height: 420px;
      }
    }

    @media (max-width: 480px) {
      .hero-section {
        --hero-media-bottom-trim: 16px;
      }

      .hero-title {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 1.1rem;
      }
      
      .value-points-grid,
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .hero-image {
        min-height: 240px;
      }

      .video-container {
        transform: scale(1);
      }
      
      .welcome-video-canvas {
        max-height: 320px;
      }
    }

    @media (min-width: 1024px) {
      .video-container {
        transform: scale(1.35);
      }
    }

    /* Popular Tours Section */
    .popular-tours-section {
      padding: 80px 0;
      background: #f8fafc; /* Very light slate background */
    }

    .section-tag {
      font-family: 'Nothing You Could Do', cursive;
      color: var(--primary-color);
      font-size: 1.5rem;
      margin-bottom: 8px;
      display: block;
    }

    .header-decoration {
      position: absolute;
      top: 0;
      right: 0;
    }

    .doodle-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.2;
      transform: rotate(-15deg);
    }

    .popular-tours-scroll-wrapper {
      overflow-x: auto;
      padding: 20px 0 40px; /* Bottom padding for shadow */
      margin: 0 -16px; /* Negative margin to allow full-width scroll on mobile */
      padding-left: 16px; /* Restore padding */
      padding-right: 16px;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
      scrollbar-width: none; /* Firefox */
    }

    .popular-tours-scroll-wrapper::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    .popular-tours-track {
      display: flex;
      gap: 32px;
      width: max-content;
    }

    .popular-tour-card {
      flex: 0 0 340px;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
      scroll-snap-align: center;
      position: relative;
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.03);
    }

    .popular-tour-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(0,0,0,0.08);
    }

    .tour-image-box {
      position: relative;
      height: 220px;
      overflow: hidden;
    }

    .tour-image-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .popular-tour-card:hover .tour-image-box img {
      transform: scale(1.05);
    }

    .badges-container {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 8px;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .feature-badge {
      background: #f4b416; /* Orange */
    }

    .discount-badge {
      background: #22c55e; /* Green */
    }

    .duration-badge {
      position: absolute;
      bottom: 16px;
      right: 16px;
      background: white;
      color: var(--text-primary);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .tour-content {
      padding: 24px;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .stars {
      display: flex;
      color: #fbbf24;
    }

    .star-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .rating-text {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .tour-content h3 {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 8px;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .location-row {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 16px;
    }

    .location-row mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .tour-excerpt {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 24px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      padding: 16px 0;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item .label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item .value {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .book-btn {
      width: 100%;
      border-radius: 12px !important;
      padding: 24px !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
    }

    /* Blog Section */
    .blog-section {
      padding: 80px 0;
      background: #f0fdf4; /* Light green tint matching the reference */
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      margin-top: 48px;
    }

    .blog-card {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(0,0,0,0.03);
    }

    .blog-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }

    .blog-image-container {
      height: 240px;
      overflow: hidden;
    }

    .blog-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .blog-card:hover .blog-image {
      transform: scale(1.05);
    }

    .blog-content {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .blog-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .blog-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .blog-meta mat-icon {
      font-size: 16px !important;
      width: 16px;
      height: 16px;
    }

    .blog-title {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 12px;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .blog-excerpt {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 24px;
      flex: 1;
      font-size: 0.95rem;
    }

    .blog-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }

    .blog-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .read-more-btn.mat-mdc-button {
      color: var(--text-secondary);
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .read-more-btn.mat-mdc-button:hover {
      color: var(--primary-color);
      background: rgba(45, 212, 191, 0.05);
    }
  `]
})
export class HomePageComponent implements OnInit {
  private toursService = inject(ToursService);
  private blogsService = inject(BlogsService);
  private destinationsService = inject(DestinationsService);

  popularTours: any[] = [];
  latestBlogs: any[] = [];
  destinations: any[] = [];

  showShopLaunch = true;

  ngOnInit() {
    this.toursService.listTours().subscribe({
      next: (tours) => {
        if (tours && tours.length > 0) {
          this.popularTours = tours.slice(0, 8).map(tour => ({
            ...tour,
            durationString: `${tour.durationDays} Days - ${tour.durationDays - 1} Nights`
          }));
        } else {
          console.warn('No popular tours found or empty list returned');
        }
      },
      error: (err) => {
        console.error('Error loading popular tours:', err);
      }
    });

    // Fetch latest blogs
    this.blogsService.listPublishedBlogs().subscribe({
      next: (blogs) => {
        if (blogs && blogs.length > 0) {
          // Sort is already done in service, but just to be sure we take top 3
          this.latestBlogs = blogs.slice(0, 3).map(blog => ({
            ...blog,
            // Create a mock comment count if not present
            commentCount: blog.commentCount || Math.floor(Math.random() * 10) + 1,
            // Create a truncated excerpt if summary is missing
            excerpt: blog.summary || (blog.content ? blog.content.substring(0, 100) + '...' : '')
          }));
        }
      },
      error: (err) => console.error('Error loading blogs:', err)
    });

    this.destinations = this.destinationsService.getDestinations();
  }

  features = [
    {
      icon: 'accessibility',
      title: 'Barrier-Free Experiences',
      description: 'Every tour designed with accessibility at its core',
      gradient: 'primary-gradient'
    },
    {
      icon: 'diversity_3',
      title: 'Genuine Community Roots',
      description: 'Founded and operated by the Deaf community',
      gradient: 'accent-gradient'
    },
    {
      icon: 'landscape',
      title: 'Unforgettable Adventures',
      description: 'Discover Sri Lanka\'s hidden gems and cultural treasures',
      gradient: 'secondary-gradient'
    },
    {
      icon: 'verified',
      title: 'Trusted Worldwide',
      description: 'Recognized by international Deaf organizations',
      gradient: 'success-gradient'
    }
  ];



  // Slider Logic
  currentSlide = 0;
  slides = [
    {
      image: '/c1.JPG',
      alt: 'Sri Lankan Adventures',
      caption: ''
    },
    {
      image: '/c2.JPG',
      alt: 'Cultural Wonders',
      caption: ''
    },
    {
      image: '/c3.jpeg',
      alt: 'Unforgettable Moments',
      caption: ''
    }
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }

  testimonials = [
    {
      name: 'Diede Hettinga',
      location: 'Netherlands',
      image: '/Diede_Hettinga.jpeg',
      quote: 'Half a year ago I met praveen and his parents. I stayed with them for a few weeks, I felt super welcome and they were so willing to help with everything. They do everything from their heart and are so talented in what they do. I feel so lucky that I have met them.'
    },
    {
      name: 'Lisa',
      location: 'Germany',
      image: '/Lisa.jpeg',
      quote: 'A very nice family, very clean rooms. The owner offers excursions by the day or week, with a chauffeur upon request. I personally experienced a wonderful multi-day tour through northeastern central Sri Lanka with the owner and a chauffeur.'
    },
    {
      name: 'Pavilic',
      location: 'Germany',
      image: '/Pavlic.jpeg',
      quote: 'We stayed near the airport on arrival and immediately knew we would return before departure—the warm, welcoming family made it special. Comfortable rooms, thoughtful meals, and their kindness (even taking me to a cricket match) made our stay unforgettable. Wishing them success, health, and continued warmth!'
    }
  ];

  closeShopLaunch() {
    this.showShopLaunch = false;
  }
}