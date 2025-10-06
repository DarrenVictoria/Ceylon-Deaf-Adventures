import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';

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
    <div 
      *ngIf="showDevelopmentNotice" 
      class="modal-overlay"
      (click)="closeDevelopmentNotice()"
    >
      <mat-card class="modal-card" (click)="$event.stopPropagation()">
        <mat-card-header class="development-notice-header">
          <div mat-card-avatar class="notice-avatar">
            <mat-icon class="notice-icon">construction</mat-icon>
          </div>
          <mat-card-title>Development Notice</mat-card-title>
          <button 
            mat-icon-button 
            (click)="closeDevelopmentNotice()"
            class="close-button"
          >
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content class="notice-content">
          <p>
            This website is currently under development. Some features may not be fully functional yet. 
            We appreciate your patience as we work to create the best accessible tourism experience.
          </p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="closeDevelopmentNotice()">
            Understood
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

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
                <video 
                  #greenscreenVideo
                  src="480p.mp4"
                  class="welcome-video hidden"
                  muted
                  autoplay
                  loop
                  playsinline
                  preload="auto"
                ></video>
                <canvas 
                  #videoCanvas
                  class="welcome-video-canvas"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Value Points -->
    <section class="value-points-section" style="padding:4rem;">
      <div class="container">
        <div class="value-points-grid">
          <mat-card class="value-card" matRipple>
            <mat-card-content class="value-content">
              <div class="value-icon primary-gradient">
                <mat-icon>emoji_events</mat-icon>
              </div>
              <h3>1st Deaf-Friendly Provider</h3>
              <p>Sri Lanka's pioneering accessible tourism company</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="value-card" matRipple>
            <mat-card-content class="value-content">
              <div class="value-icon accent-gradient">
                <mat-icon>schedule</mat-icon>
              </div>
              <h3>8+ Years Experience</h3>
              <p>Accessible tourism expertise since 2014</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="value-card" matRipple>
            <mat-card-content class="value-content">
              <div class="value-icon secondary-gradient">
                <mat-icon>groups</mat-icon>
              </div>
              <h3>Qualified Deaf Guides</h3>
              <p>Sign language interpreters & Deaf guides</p>
            </mat-card-content>
          </mat-card>
      

          
          
        </div>
      </div>
    </section>

    <!-- Why Travel With Us -->
    <section class="why-travel-section" style="padding:4rem 0;">
      <div class="container">
        <div class="section-header">
          <h2>Why Travel With Us</h2>
          <p class="section-subtitle">
            Experience Sri Lanka through barrier-free adventures designed by and for the Deaf community
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-item" *ngFor="let feature of features">
            <div class="feature-icon" [ngClass]="feature.gradient">
              <mat-icon>{{ feature.icon }}</mat-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
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
            *ngFor="let destination of destinations"
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
                [routerLink]="['/tours']"
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
  `,
  styles: [`
    /* Global Variables */
    mat-icon {
      font-size: 20px !important;
    }
    :host {
      --primary-color: #2dd4bf;
      --primary-light: #5eead4;
      --primary-dark: #0f766e;
      --accent-color: #f97316;
      --accent-light: #fed7aa;
      --secondary-color: #6366f1;
      --success-color: #10b981;
      --background-color: #ffffff;
      --surface-color: #f8fafc;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      display: block;
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
      padding: 80px 0;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      align-items: center;
      margin:3rem;
    }

    @media (min-width: 1024px) {
      .hero-grid {
        grid-template-columns: 1fr 1fr;
        align-items: flex-end;
      }
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
      color: var(--primary-color);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
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

    /* Green Screen Video Styles */
    .hero-image {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      min-height: 400px;
      position: relative;
    }

    @media (min-width: 1024px) {
      .hero-image {
        min-height: 600px;
      }
    }

    .video-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      transform: scale(1.5);
    }

    .welcome-video {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .welcome-video.hidden {
      display: none;
    }

    .welcome-video-canvas {
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
      margin-bottom: -3rem;
    }

    .welcome-video-canvas:hover {
      transform: scale(1.02);
    }

    /* Loading state */
    .video-container::before {
      content: '';
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform: translate(-50%, 50%);
      width: 50px;
      height: 50px;
      border: 4px solid rgba(45, 212, 191, 0.3);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .video-container:has(.welcome-video-canvas[width])::before {
      display: none;
    }

    @keyframes spin {
      to { transform: translate(-50%, 50%) rotate(360deg); }
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
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .value-icon mat-icon {
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

    /* Why Travel Section */
    .why-travel-section {
      padding: 80px 0;
      background: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .section-header h2 {
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

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 48px;
    }

    .feature-item {
      text-align: center;
    }

    .feature-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      animation: float 6s ease-in-out infinite;
    }

    .feature-icon mat-icon {
      font-size: 40px;
      color: white;
    }

    .feature-item h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .feature-item p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Destinations Section */
    .destinations-section {
      padding: 80px 0;
      background: linear-gradient(135deg, var(--surface-color), #f1f5f9);
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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
        min-height: 350px;
      }
      
      .welcome-video-canvas {
        max-height: 500px;
      }
    }

    @media (max-width: 480px) {
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
        min-height: 300px;
      }
      
      .welcome-video-canvas {
        max-height: 400px;
      }
    }
  `]
})
export class HomePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('greenscreenVideo') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoCanvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  showDevelopmentNotice = true;
  private animationFrameId: number | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private keyColor = { r: 79, g: 160, b: 141 };
  private similarity = 0.45;     // Balanced keying strength
  private smoothness = 0.15;     // Clean edges
  private spill = 0.15;          // Minimal green tint removal
  private minGreen = 100;

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

  destinations = [
    {
      image: '/Esala_Perahara.jpg',
      alt: 'Kandy Esala Perahera festival',
      icon: 'celebration',
      title: 'Kandy Esala Perahera',
      description: 'Sri Lanka\'s grandest festival with glowing elephants, dancers, drummers and sacred traditions—an unforgettable cultural spectacle in Kandy.',
      credit: 'Photo: Sovindu Rashmika'
    },
    {
      image: '/Ella.jpg',
      alt: 'Ella misty mountain village',
      icon: 'landscape',
      title: 'Ella',
      description: 'A misty mountain village with tea fields, waterfalls and the iconic Nine Arch Bridge—perfect for hikes and scenic train rides.',
      credit: 'Photo: Lisa'
    },
    {
      image: '/Nuwara_Eliya.jpg',
      alt: 'Nuwara Eliya tea country',
      icon: 'local_cafe',
      title: 'Nuwara Eliya (Little England)',
      description: 'Tea country charm with cool climates, colonial vibes and the world\'s finest high-grown Ceylon tea.',
      credit: 'Photo: Darren Victoria'
    },
    {
      image: 'negombo.jpeg',
      alt: 'Negombo beach and fish market',
      icon: 'beach_access',
      title: 'Negombo',
      description: 'Golden beaches, a bustling fish market and rich colonial heritage—your coastal gateway near Colombo.',
      credit: 'Photo: Tristan'
    },
    {
      image: '/Colombo.jpg',
      alt: 'Colombo city',
      icon: 'apartment',
      title: 'Colombo',
      description: 'Sri Lanka\'s lively capital with temples, markets, parks, museums and modern city vibes all in one.',
      credit: 'Photo: Isuru Dev Thilina'
    },
    {
      image: '/Sigiriya.jpg',
      alt: 'Sigiriya Lion Rock',
      icon: 'terrain',
      title: 'Sigiriya (Lion Rock)',
      description: 'A UNESCO wonder—climb through lion paws to ancient palace ruins and breathtaking views.',
      credit: 'Photo: Lisa'
    },
    {
      image: '/Down_South.jpg',
      alt: 'South coast beaches and Galle Fort',
      icon: 'beach_access',
      title: 'Down South',
      description: 'Beaches, surfing, whale watching, Galle Fort and lush rainforests—the south is where culture meets paradise.',
      credit: 'Photo: Lisa'
    },
    {
      image: '/Anuradhapura.jpg',
      alt: 'Anuradhapura ancient ruins',
      icon: 'account_balance',
      title: 'Anuradhapura',
      description: 'Sri Lanka\'s ancient capital with sacred stupas, ruins and the legendary Sri Maha Bodhi tree.',
      credit: 'Photo: Isuru Dev Thilina'
    },
    {
      image: '/Sri_Pada.jpg',
      alt: 'Adam\'s Peak sunrise climb',
      icon: 'hiking',
      title: 'Adams Peak (Sri Pada)',
      description: 'A sacred climb to witness sunrise above the clouds—spiritual unity and natural wonder in one.',
      credit: 'Photo: Nadeesha Fernando'
    },
    {
      image: '/Pollonaruwa.jpg',
      alt: 'Pollonaruwa ancient ruins',
      icon: 'account_balance',
      title: 'Pollonaruwa',
      description: 'Polonnaruwa, Sri Lanka\'s medieval capital and a UNESCO World Heritage Site, renowned for its ancient ruins and remarkable Sinhalese architecture.',
      credit: 'Photo: Isuru Dev Thilina'
    }
  ];

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

  ngAfterViewInit() {
    // Initialize video after view is ready
    setTimeout(() => {
      this.initGreenScreenVideo();
    }, 100);
  }

  ngOnDestroy() {
    // Clean up animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  initGreenScreenVideo() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!this.ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Ensure video is muted
    video.muted = true; // Programmatically set muted property
    video.loop = true;

    // Wait for video metadata to load
    video.addEventListener('loadedmetadata', () => {
      console.log('Video metadata loaded:', video.videoWidth, 'x', video.videoHeight);

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Start playing and processing
      video.play().then(() => {
        console.log('Video playing');
        this.processVideo();
      }).catch(err => {
        console.error('Error playing video:', err);
      });
    });

    // Additional check - if metadata is already loaded
    if (video.readyState >= 2) {
      console.log('Video already loaded, starting playback');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.muted = true; // Ensure muted here as well
      video.play().then(() => {
        console.log('Video playing (immediate start)');
        this.processVideo();
      }).catch(err => {
        console.error('Error playing video:', err);
      });
    }

    // Ensure video plays after any user interaction
    video.addEventListener('canplay', () => {
      if (video.paused) {
        console.log('Video can play, attempting to start');
        video.muted = true; // Ensure muted on canplay
        video.play().catch(err => {
          console.error('Autoplay prevented:', err);
        });
      }
    });

    // Handle video end - ensure it loops and continues processing
    video.addEventListener('ended', () => {
      console.log('Video ended, restarting...');
      video.currentTime = 0;
      video.muted = true; // Ensure muted on loop
      video.play().then(() => {
        console.log('Video looped and playing again');
        // Ensure processing continues
        if (!this.animationFrameId) {
          this.processVideo();
        }
      }).catch(err => {
        console.error('Error restarting video:', err);
      });
    });

    // Handle video errors
    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      console.error('Error code:', video.error?.code);
      console.error('Error message:', video.error?.message);
    });

    // Force load the video
    video.load();
  }


  private processVideo() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    // Always continue the animation loop, even if video temporarily paused
    this.animationFrameId = requestAnimationFrame(() => this.processVideo());

    // Check if video is ready and playing
    if (!this.ctx || !video || video.readyState < 2) {
      return;
    }

    // If video ended but loop didn't trigger, restart it
    if (video.ended) {
      console.log('Video ended in processVideo, restarting...');
      video.currentTime = 0;
      video.play().catch(err => console.error('Error restarting in processVideo:', err));
      return;
    }

    // If video is paused (but not ended), try to resume
    if (video.paused) {
      video.play().catch(err => console.error('Error resuming video:', err));
      return;
    }

    try {
      // Draw the current video frame
      this.ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data
      const frame = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      // Process each pixel for chroma keying
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // CRITICAL: Only process pixels that are actually green
        // This prevents blue/cyan colors from being keyed out
        const isGreenDominant = g > r && g > b && g > this.minGreen;

        if (!isGreenDominant) {
          // Skip this pixel - it's not green enough
          continue;
        }

        // Method 1: RGB Distance-based keying
        const rDiff = (r - this.keyColor.r) / 255;
        const gDiff = (g - this.keyColor.g) / 255;
        const bDiff = (b - this.keyColor.b) / 255;

        // Calculate distance in normalized color space
        const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);

        // Method 2: Greenness detection (works better for green screens)
        const greenness = (2 * g - r - b) / 255;

        // Combine both methods
        let mask = 0;

        // Check if pixel is green enough
        if (greenness > 0.4) { // Increased threshold to be more selective
          // Calculate how "green" it is relative to similarity threshold
          mask = Math.min(1, greenness / this.similarity);
        }

        // Also check RGB distance
        if (distance < this.similarity * 1.2) { // Reduced multiplier for tighter matching
          const distanceMask = 1 - (distance / (this.similarity * 1.2));
          mask = Math.max(mask, distanceMask);
        }

        // Apply smoothness for edge feathering
        let alpha = 255;
        if (mask > 0) {
          if (mask > (1 - this.smoothness)) {
            alpha = 0; // Fully transparent
          } else {
            // Smooth transition
            alpha = Math.floor((1 - (mask / (1 - this.smoothness))) * 255);
          }
        }

        // Green spill suppression (reduce green from remaining pixels)
        if (alpha > 10 && g > r && g > b) {
          const spillAmount = (g - Math.max(r, b)) * this.spill;
          data[i + 1] = Math.max(0, g - spillAmount);
        }

        data[i + 3] = alpha;
      }

      // Put the processed frame back
      this.ctx.putImageData(frame, 0, 0);
    } catch (error) {
      console.error('Error processing video frame:', error);
    }
  }

  closeDevelopmentNotice() {
    this.showDevelopmentNotice = false;
  }
}