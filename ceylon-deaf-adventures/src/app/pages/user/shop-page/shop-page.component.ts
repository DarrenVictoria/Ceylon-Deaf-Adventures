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
  selector: 'app-shop-page',
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
      <div class="hero-background">
        <div class="hero-pattern"></div>
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <div class="coming-soon-badge">
              <mat-icon>schedule</mat-icon>
              <span>Coming Soon</span>
            </div>
            <h1 class="hero-title">
              Ceylon <span class="highlight-text">Craft</span> Shop
            </h1>
            <p class="hero-description">
              An ethical e-commerce destination celebrating Sri Lankan craftsmanship while empowering our deaf artisan community. 
              Authentic products, meaningful impact.
            </p>
            <div class="hero-features">
              <div class="feature-pill">
                <mat-icon>handshake</mat-icon>
                <span>Empowering Deaf Artisans</span>
              </div>
              <div class="feature-pill">
                <mat-icon>eco</mat-icon>
                <span>Ethically Sourced</span>
              </div>
              <div class="feature-pill">
                <mat-icon>local_shipping</mat-icon>
                <span>Authentic Sri Lankan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-content">
            <h2 class="section-title">Our Mission</h2>
            <p class="mission-description">
              Ceylon Craft Shop isn't just another online store—it's a bridge connecting authentic Sri Lankan craftsmanship 
              with global customers while creating meaningful employment opportunities for deaf artisans across our beautiful island.
            </p>
            <div class="mission-highlights">
              <div class="highlight-item">
                <div class="highlight-icon success-gradient">
                  <mat-icon>people</mat-icon>
                </div>
                <div>
                  <h4>Empowering Deaf Creators</h4>
                  <p>Supporting talented deaf artisans by showcasing and selling their handmade masterpieces</p>
                </div>
              </div>
              <div class="highlight-item">
                <div class="highlight-icon primary-gradient">
                  <mat-icon>public</mat-icon>
                </div>
                <div>
                  <h4>Promoting Local Craftsmanship</h4>
                  <p>Celebrating centuries-old Sri Lankan traditions through authentic, culturally inspired products</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mission-visual">
            <div class="visual-card">
              <mat-icon >favorite</mat-icon>
              <h3>Made with Love</h3>
              <p>Every product tells a story of passion, tradition, and community</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Preview Section -->
    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">What's Coming</h2>
          <p class="section-subtitle">A curated collection of authentic Sri Lankan treasures</p>
        </div>

        <div class="products-grid">
          <mat-card class="product-card" *ngFor="let product of upcomingProducts" matRipple>
            <div class="product-image">
              <div class="product-icon" [ngClass]="product.gradient">
                <mat-icon>{{ product.icon }}</mat-icon>
              </div>
              <div class="product-badge">{{ product.badge }}</div>
            </div>
            <mat-card-content class="product-content">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-features">
                <span class="feature-tag" *ngFor="let feature of product.features">{{ feature }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Artisan Spotlight Section -->
    <section class="artisan-section">
      <div class="container">
        <div class="artisan-content">
          <div class="artisan-text">
            <h2 class="section-title">Meet Our Artisans</h2>
            <p class="artisan-description">
              Behind every product is a talented deaf artisan whose skill and creativity bring Sri Lankan culture to life. 
              Through our shop, these remarkable creators gain economic independence while preserving traditional crafts 
              for future generations.
            </p>
            
            <div class="artisan-stats">
              <div class="stat-item">
                <div class="stat-number">50+</div>
                <div class="stat-label">Deaf Artisans</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">15</div>
                <div class="stat-label">Craft Categories</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">100%</div>
                <div class="stat-label">Handmade</div>
              </div>
            </div>

            <div class="artisan-quote">
              <mat-icon class="quote-icon">format_quote</mat-icon>
              <p class="quote-text">
                "Our hands speak the language of tradition, creating beauty that transcends barriers."
              </p>
              <p class="quote-author">— Ceylon Deaf Adventures Artisan Community</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <!--<section class="newsletter-section">
      <div class="newsletter-background"></div>
      <div class="newsletter-overlay"></div>
      <div class="newsletter-content">
        <div class="container">
          <div class="newsletter-text">
            <mat-icon class="newsletter-icon">notifications</mat-icon>
            <h2 class="newsletter-title">Be the First to Know</h2>
            <p class="newsletter-description">
              Get notified when Ceylon Craft Shop launches and be among the first to support our amazing deaf artisan community.
            </p>
            <div class="newsletter-form">
              <div class="form-input">
                <mat-icon>email</mat-icon>
                <input type="email" placeholder="Enter your email address">
              </div>
              <button mat-raised-button color="accent" class="notify-button">
                <mat-icon>send</mat-icon>
                Notify Me
              </button>
            </div>
            <p class="newsletter-note">
              <mat-icon>security</mat-icon>
              Your email is safe with us. No spam, just updates about our artisan community and shop launch.
            </p>
          </div>
        </div>
      </div>
    </section>-->
  `,
  styles: [`
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

    mat-icon{
      font-size: 24px !important;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      min-height: 80vh;
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
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      opacity: 0.1;
    }

    .hero-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(45, 212, 191, 0.1) 0%, transparent 50%);
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

    .hero-text {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .coming-soon-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      font-weight: 600;
      margin-bottom: 32px;
      animation: pulse 2s infinite;
    }

    .coming-soon-badge mat-icon {
      font-size: 20px;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.1;
      margin-bottom: 24px;
      animation: fadeInUp 1s ease-out;
    }

    @media (min-width: 1024px) {
      .hero-title {
        font-size: 4.5rem;
      }
    }

    .highlight-text {
      color: var(--accent-color);
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.3rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 40px;
      animation: fadeInUp 1s ease-out 0.2s both;
    }

    .hero-features {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      animation: fadeInUp 1s ease-out 0.4s both;
    }

    .feature-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      padding: 12px 20px;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      font-weight: 600;
      color: var(--text-primary);
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .feature-pill:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }

    .feature-pill mat-icon {
      color: var(--accent-color);
      font-size: 20px;
    }

    /* Mission Section */
    .mission-section {
      padding: 100px 0;
      background: white;
    }

    .mission-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 64px;
      align-items: center;
    }

    @media (min-width: 1024px) {
      .mission-grid {
        grid-template-columns: 2fr 1fr;
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

    .mission-description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 40px;
    }

    .mission-highlights {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .highlight-item {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .highlight-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .highlight-icon mat-icon {
      color: white;
      font-size: 28px;
    }

    .primary-gradient {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    }

    .accent-gradient {
      background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
    }

    .success-gradient {
      background: linear-gradient(135deg, var(--success-color), #6ee7b7);
    }

    .highlight-item h4 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .highlight-item p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .visual-card {
      background: linear-gradient(135deg, var(--surface-color), white);
      padding: 48px 32px;
      border-radius: 24px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .visual-card:hover {
      border-color: var(--primary-color);
      transform: translateY(-8px);
    }

    .large-icon {
      font-size: 64px !important;
      color: var(--accent-color);
      margin-bottom: 24px;
      display: block;
    }

    .visual-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .visual-card p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    /* Products Section */
    .products-section {
      padding: 100px 0;
      background: linear-gradient(135deg, var(--surface-color), #f1f5f9);
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

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .product-card {
      border-radius: 20px !important;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      overflow: hidden;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .product-image {
      position: relative;
      height: 200px;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-icon mat-icon {
      font-size: 40px;
      color: white;
    }

    .product-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--accent-color);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .product-content {
      padding: 32px 24px !important;
    }

    .product-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .product-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .product-features {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .feature-tag {
      background: rgba(45, 212, 191, 0.1);
      color: var(--primary-dark);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    /* Artisan Section */
    .artisan-section {
      padding: 100px 0;
      background: white;
    }

    .artisan-description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 48px;
    }

    .artisan-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 32px;
      margin-bottom: 48px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      color: var(--text-secondary);
      font-weight: 600;
    }

    .artisan-quote {
      background: linear-gradient(135deg, rgba(45, 212, 191, 0.05), rgba(249, 115, 22, 0.05));
      padding: 32px;
      border-radius: 20px;
      border-left: 4px solid var(--accent-color);
      position: relative;
    }

    .quote-icon {
      color: var(--accent-color);
      font-size: 32px !important;
      margin-bottom: 16px;
    }

    .quote-text {
      font-size: 1.2rem;
      font-style: italic;
      color: var(--text-primary);
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .quote-author {
      color: var(--text-secondary);
      font-weight: 600;
      margin: 0;
    }

    /* Newsletter Section */
    .newsletter-section {
      position: relative;
      padding: 100px 0;
      overflow: hidden;
    }

    .newsletter-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      opacity: 0.1;
    }

    .newsletter-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(45, 212, 191, 0.9), rgba(249, 115, 22, 0.8));
    }

    .newsletter-content {
      position: relative;
      z-index: 10;
    }

    .newsletter-text {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .newsletter-icon {
      font-size: 48px !important;
      color: white;
      margin-bottom: 24px;
      display: block;
    }

    .newsletter-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 24px;
    }

    .newsletter-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .newsletter-form {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .form-input {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 50px;
      padding: 12px 24px;
      flex: 1;
      max-width: 400px;
      gap: 12px;
    }

    .form-input mat-icon {
      color: var(--text-secondary);
    }

    .form-input input {
      border: none;
      outline: none;
      background: none;
      flex: 1;
      font-size: 1rem;
    }

    .notify-button {
      padding: 12px 32px !important;
      border-radius: 50px !important;
      height: auto !important;
      font-weight: 600 !important;
    }

    .newsletter-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }

    .newsletter-note mat-icon {
      font-size: 18px;
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
      
      .newsletter-form {
        flex-direction: column;
        align-items: center;
      }
      
      .form-input {
        width: 100%;
        max-width: 100%;
      }
      
      .newsletter-title {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 1.1rem;
      }
      
      .hero-features {
        flex-direction: column;
        align-items: center;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
      
      .artisan-stats {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      
      .stat-number {
        font-size: 2rem;
      }
    }
  `]
})
export class ShopPageComponent {
  upcomingProducts = [
    {
      icon: 'local_cafe',
      title: 'Ceylon Tea Collection',
      description: 'Premium black, green, and white teas from the misty mountains of Ceylon, hand-picked and packaged by our deaf artisan partners.',
      badge: 'Signature',
      gradient: 'primary-gradient',
      features: ['Organic', 'Fair Trade', 'Mountain Grown']
    },
    {
      icon: 'restaurant',
      title: 'Authentic Spices',
      description: 'Traditional Sri Lankan spice blends and individual spices, carefully selected and packaged to bring the true taste of Ceylon to your kitchen.',
      badge: 'Popular',
      gradient: 'accent-gradient',
      features: ['Fresh Ground', 'Traditional Recipes', 'Aromatic']
    },
    {
      icon: 'palette',
      title: 'Handmade Crafts',
      description: 'Beautiful traditional Sri Lankan handicrafts including wood carvings, batik art, and woven baskets created by skilled deaf artisans.',
      badge: 'Artisan Made',
      gradient: 'success-gradient',
      features: ['Handcrafted', 'Cultural Heritage', 'Unique Designs']
    },
    {
      icon: 'checkroom',
      title: 'Custom T-Shirts',
      description: 'Comfortable, ethically-made t-shirts featuring Sri Lankan-inspired designs and deaf culture motifs, printed with eco-friendly inks.',
      badge: 'Custom',
      gradient: 'primary-gradient',
      features: ['Eco-Friendly', 'Custom Designs', 'Comfortable Fit']
    },
    {
      icon: 'card_giftcard',
      title: 'Gift Collections',
      description: 'Thoughtfully curated gift sets combining the best of Sri Lankan culture - perfect for sharing the warmth of Ceylon with loved ones.',
      badge: 'Curated',
      gradient: 'accent-gradient',
      features: ['Ready to Gift', 'Premium Packaging', 'Cultural Story']
    },
    {
      icon: 'spa',
      title: 'Natural Wellness',
      description: 'Ayurvedic oils, herbal teas, and natural skincare products made using traditional Sri Lankan recipes and healing wisdom.',
      badge: 'Wellness',
      gradient: 'success-gradient',
      features: ['Natural Ingredients', 'Traditional Recipes', 'Healing Properties']
    }
  ];
}