import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatBadgeModule,
    MatDividerModule
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
              Connecting Heart and <span class="highlight-text">Heritage</span>
            </h1>
            <p class="hero-description">
              Born from a passion to create a world where Deaf travelers can explore freely and fully, 
              Ceylon Deaf Adventures bridges cultures and communities through accessible tourism.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Founder's Story -->
    <section class="story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <h2 class="section-title">Our Story</h2>
            <div class="story-text">
              <p class="story-paragraph">
                In 2014, our founder recognized a gap in Sri Lanka's tourism industry—the lack of truly accessible
                experiences for the Deaf community. What started as a personal mission to share Sri Lanka's beauty
                with Deaf friends from around the world has grown into the country's first dedicated Deaf-friendly
                tourism company.
              </p>
              <p class="story-paragraph">
                Our journey began with simple homestay experiences, where visual communication and cultural immersion
                took precedence over traditional audio-based tours. We discovered that when barriers are removed, the
                connections formed between travelers and local communities become deeper and more meaningful.
              </p>
              <mat-card class="highlight-card">
                <mat-card-content>
                  <mat-icon class="highlight-icon">celebration</mat-icon>
                  <p class="highlight-text">
                    Today, we're proud to have served over 1,000 Deaf and hearing guests from around the world, 
                    each carrying home not just memories, but a piece of Sri Lankan warmth and hospitality.
                  </p>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
          <div class="story-image">
            <img
              src="/ceylon-deaf-adventures-family.png"
              alt="Ceylon Deaf Adventures founder with local Sri Lankan family"
              class="founder-image"
            />
            <div class="image-decoration"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission, Vision, Motto -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-grid">
          <mat-card class="mission-card vision-card" matRipple>
            <mat-card-content class="mission-content">
              <div class="mission-icon primary-gradient">
                <mat-icon>visibility</mat-icon>
              </div>
              <h3 class="mission-title">Vision</h3>
              <p class="mission-description">
                To become Asia's #1 Deaf adventure tourism company, setting the global standard for inclusive travel
                experiences that celebrate diversity and cultural exchange.
              </p>
            </mat-card-content>
          </mat-card>

          <mat-card class="mission-card mission-main-card" matRipple>
            <mat-card-content class="mission-content">
              <div class="mission-icon accent-gradient">
                <mat-icon>my_location</mat-icon>
              </div>
              <h3 class="mission-title">Mission</h3>
              <p class="mission-description">
                To uplift lives and foster true belonging through accessible adventure tourism, creating meaningful
                connections between the global Deaf community and Sri Lankan culture.
              </p>
            </mat-card-content>
          </mat-card>

          <mat-card class="mission-card motto-card" matRipple>
            <mat-card-content class="mission-content">
              <div class="mission-icon secondary-gradient">
                <mat-icon>favorite</mat-icon>
              </div>
              <h3 class="mission-title">Motto</h3>
              <p class="motto-text">
                "Travel Without Barriers, Belong Without Bounds"
              </p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Milestones Timeline -->
    <section class="timeline-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Journey</h2>
          <p class="section-subtitle">Key milestones in creating barrier-free tourism</p>
        </div>

        <div class="timeline">
          <div class="timeline-item" *ngFor="let milestone of milestones; let i = index">
            <div class="timeline-year">
              <span class="year-badge" [ngClass]="milestone.colorClass">{{ milestone.year }}</span>
            </div>
            <div class="timeline-connector">
              <div class="timeline-dot" [ngClass]="milestone.colorClass"></div>
              <div class="timeline-line" *ngIf="i < milestones.length - 1"></div>
            </div>
            <mat-card class="timeline-card" matRipple>
              <mat-card-content>
                <div class="timeline-icon" [ngClass]="milestone.gradient">
                  <mat-icon>{{ milestone.icon }}</mat-icon>
                </div>
                <h3 class="timeline-title">{{ milestone.title }}</h3>
                <p class="timeline-description">{{ milestone.description }}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="values-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Core Values</h2>
          <p class="section-subtitle">The principles that guide everything we do</p>
        </div>

        <div class="values-grid">
          <mat-card class="value-card" *ngFor="let value of values" matRipple>
            <mat-card-content class="value-content">
              <div class="value-icon" [ngClass]="value.gradient">
                <mat-icon>{{ value.icon }}</mat-icon>
              </div>
              <h3 class="value-title">{{ value.title }}</h3>
              <p class="value-description">{{ value.description }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="stats-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Impact</h2>
          <p class="section-subtitle">Numbers that tell our story</p>
        </div>

        <div class="stats-grid">
          <mat-card class="stat-card" *ngFor="let stat of statistics" matRipple>
            <mat-card-content class="stat-content">
              <div class="stat-icon" [ngClass]="stat.gradient">
                <mat-icon>{{ stat.icon }}</mat-icon>
              </div>
              <div class="stat-number">{{ stat.number }}</div>
              <p class="stat-label">{{ stat.label }}</p>
              <div class="stat-progress">
                <div class="progress-bar" [ngClass]="stat.colorClass" [style.width.%]="stat.progress"></div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="cta-section">
      <div class="cta-background"></div>
      <div class="cta-overlay"></div>
      <div class="cta-content">
        <div class="container">
          <div class="cta-text">
            <h2 class="cta-title">Join Us on a Journey Beyond Barriers</h2>
            <p class="cta-description">
              Experience Sri Lanka through the lens of accessibility, cultural exchange, and genuine human connection.
            </p>
            <button
              mat-raised-button
              color="accent"
              size="large"
              class="cta-button"
              [routerLink]="['/tours']"
            >
              
              Explore Our Tours Today
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`

    mat-icon{
      font-size: 24px !important;}
    /* Global Variables */
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

    /* Hero Section */
    .hero-section {
      position: relative;
      max-height: 70vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background-color: #4f9153 ;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      opacity: 0.1;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
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

    @media (min-width: 1024px) {
      .hero-title {
        font-size: 4rem;
      }
    }

    .highlight-text {
      color: var(--accent-color);
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 1em !important;
    }

    .hero-description {
      font-size: 1.25rem;
      color: var(--text-secondary);
      line-height: 1.6;
      animation: fadeInUp 1s ease-out 0.2s both;
    }

    /* Story Section */
    .story-section {
      padding: 100px 0;
      background: white;
    }

    .story-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 64px;
      align-items: center;
    }

    @media (min-width: 1024px) {
      .story-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 32px;
      position: relative;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60px;
      height: 4px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      border-radius: 2px;
    }

    .story-text {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .story-paragraph {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.8;
      margin: 0;
    }

    .highlight-card {
      background: linear-gradient(135deg, rgba(45, 212, 191, 0.05), rgba(249, 115, 22, 0.05)) !important;
      border-left: 4px solid var(--accent-color);
      transition: all 0.3s ease;
    }

    .highlight-card:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
    }

    .highlight-icon {
      color: var(--accent-color);
      font-size: 24px;
      margin-bottom: 12px;
      display: block;
    }

    .highlight-text {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1.1rem;
      line-height: 1.6;
      margin: 0;
    }

    .story-image {
      position: relative;
    }

    .founder-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 24px;
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease;
    }

    .founder-image:hover {
      transform: scale(1.02);
    }

    .image-decoration {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      border-radius: 50%;
      opacity: 0.1;
      z-index: -1;
    }

    /* Mission Section */
    .mission-section {
      padding: 100px 0;
      background: linear-gradient(135deg, var(--surface-color), white);
    }

    .mission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
    }

    .mission-card {
      transition: all 0.3s ease;
      border-radius: 24px !important;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 2px solid transparent;
    }

    .mission-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .vision-card:hover {
      border-color: var(--primary-color);
    }

    .mission-main-card:hover {
      border-color: var(--accent-color);
    }

    .motto-card:hover {
      border-color: var(--secondary-color);
    }

    .mission-content {
      padding: 40px 32px !important;
      text-align: center;
    }

    .mission-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .mission-icon mat-icon {
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

    .mission-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .mission-description {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 1rem;
    }

    .motto-text {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 1.2rem;
      font-style: italic;
      line-height: 1.6;
    }

    /* Timeline Section */
    .timeline-section {
      padding: 100px 0;
      background: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }

    .section-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-top: 16px;
    }

    .timeline {
      max-width: 800px;
      margin: 0 auto;
    }

    .timeline-item {
      display: grid;
      grid-template-columns: 120px 60px 1fr;
      gap: 24px;
      margin-bottom: 48px;
      align-items: start;
    }

    .timeline-year {
      text-align: center;
    }

    .year-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 1.1rem;
      color: white;
    }

    .primary-color {
      background-color: var(--primary-color);
    }

    .accent-color {
      background-color: var(--accent-color);
    }

    .secondary-color {
      background-color: var(--secondary-color);
    }

    .success-color {
      background-color: var(--success-color);
    }

    .timeline-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .timeline-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .timeline-line {
      width: 2px;
      height: 60px;
      background: linear-gradient(to bottom, var(--primary-color), transparent);
      margin-top: 12px;
    }

    .timeline-card {
      border-radius: 16px !important;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .timeline-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12) !important;
    }

    .timeline-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .timeline-icon mat-icon {
      font-size: 24px;
      color: white;
    }

    .timeline-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .timeline-description {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Values Section */
    .values-section {
      padding: 100px 0;
      background: linear-gradient(135deg, var(--surface-color), #f1f5f9);
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
    }

    .value-card {
      border-radius: 20px !important;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .value-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .value-content {
      padding: 32px 24px !important;
      text-align: center;
    }

    .value-icon {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .value-icon mat-icon {
      font-size: 28px;
      color: white;
    }

    .value-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .value-description {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 0.95rem;
    }

    /* Statistics Section */
    .stats-section {
      padding: 100px 0;
      background: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
    }

    .stat-card {
      border-radius: 20px !important;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .stat-content {
      padding: 40px 24px !important;
      text-align: center;
    }

    .stat-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      color: white;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 12px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 1rem;
      margin-bottom: 20px;
    }

    .stat-progress {
      width: 100%;
      height: 4px;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      border-radius: 2px;
      transition: width 1s ease-out 0.5s;
    }

    .primary-progress {
      background-color: var(--primary-color);
    }

    .accent-progress {
      background-color: var(--accent-color);
    }

    .secondary-progress {
      background-color: var(--secondary-color);
    }

    .success-progress {
      background-color: var(--success-color);
    }

    /* CTA Section */
    .cta-section {
      position: relative;
      padding: 100px 0;
      overflow: hidden;
    }

    .cta-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      opacity: 0.1;
    }

    .cta-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(45, 212, 191, 0.9), rgba(249, 115, 22, 0.8));
    }

    .cta-content {
      position: relative;
      z-index: 10;
    }

    .cta-text {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 24px;
    }

    .cta-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .cta-button {
      font-size: 1.1rem !important;
      padding: 16px 40px !important;
      height: auto !important;
      border-radius: 30px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
      transition: all 0.3s ease !important;
    }

    .cta-button:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3) !important;
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

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .container {
        padding: 0 16px;
      }
      
      .timeline-item {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 16px;
      }
      
      .timeline-line {
        display: none;
      }
      
      .cta-title {
        font-size: 2rem;
      }
      
      .stat-number {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 1.1rem;
      }
      
      .values-grid,
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutPageComponent {
  milestones = [
    {
      year: '2014',
      title: 'First Deaf-Friendly Tours',
      description: 'Launched our pioneering accessible tourism experiences with visual guides and sign language interpretation.',
      icon: 'launch',
      colorClass: 'primary-color',
      gradient: 'primary-gradient'
    },
    {
      year: '2017',
      title: 'Deaf-Friendly Homestay',
      description: 'Established our first fully accessible homestay accommodation with visual communication systems.',
      icon: 'home',
      colorClass: 'accent-color',
      gradient: 'accent-gradient'
    },
    {
      year: '2020',
      title: '1,000+ Guests Milestone',
      description: 'Celebrated serving over 1,000 Deaf and hearing guests from around the world with barrier-free experiences.',
      icon: 'celebration',
      colorClass: 'secondary-color',
      gradient: 'secondary-gradient'
    },
    {
      year: '2024',
      title: 'International Recognition',
      description: 'Partnerships with international Deaf organizations and recognition as a leader in accessible tourism.',
      icon: 'verified',
      colorClass: 'success-color',
      gradient: 'success-gradient'
    }
  ];

  values = [
    {
      icon: 'groups',
      title: 'Inclusivity',
      description: 'Creating spaces where everyone belongs, regardless of hearing ability',
      gradient: 'primary-gradient'
    },
    {
      icon: 'handshake',
      title: 'Respect',
      description: 'Honoring Deaf culture while celebrating Sri Lankan heritage',
      gradient: 'accent-gradient'
    },
    {
      icon: 'public',
      title: 'Empowerment',
      description: 'Enabling independent exploration and meaningful cultural exchange',
      gradient: 'secondary-gradient'
    },
    {
      icon: 'star',
      title: 'Excellence',
      description: 'Delivering exceptional experiences that exceed expectations',
      gradient: 'success-gradient'
    }
  ];

  statistics = [
    {
      icon: 'emoji_events',
      number: '1st',
      label: 'Deaf-Friendly Provider in Sri Lanka',
      progress: 100,
      gradient: 'primary-gradient',
      colorClass: 'primary-progress'
    },
    {
      icon: 'schedule',
      number: '10+',
      label: 'Years of Experience',
      progress: 85,
      gradient: 'accent-gradient',
      colorClass: 'accent-progress'
    },
    {
      icon: 'people',
      number: '1000+',
      label: 'Happy Guests Served',
      progress: 90,
      gradient: 'secondary-gradient',
      colorClass: 'secondary-progress'
    },
    {
      icon: 'thumb_up',
      number: '95%',
      label: 'Guest Satisfaction Rate',
      progress: 95,
      gradient: 'success-gradient',
      colorClass: 'success-progress'
    }
  ];
}