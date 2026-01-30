import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShopService } from '../../../services/shop.service';
import { Product } from '../../../models/product.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatBadgeModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule
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
            <h1 class="hero-title">
              Ceylon <span class="highlight-text">Craft</span> Shop
            </h1>
            <p class="hero-description">
              An ethical e-commerce destination celebrating Sri Lankan craftsmanship while empowering our deaf artisan community. 
              Authentic products, meaningful impact.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Shop Section -->
    <section class="shop-section">
      <div class="container">
        
        <!-- Filters -->
        <div class="filters-container">
            <mat-chip-listbox aria-label="Product Selection">
                <mat-chip-option 
                    *ngFor="let category of categories" 
                    [selected]="(selectedCategory$ | async) === category"
                    (click)="selectCategory(category)"
                    color="primary">
                    {{category}}
                </mat-chip-option>
            </mat-chip-listbox>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" *ngIf="products$ | async as products; else loading">
          <div class="no-products" *ngIf="products.length === 0">
            <mat-icon>inventory_2</mat-icon>
            <h3>No products found in this category</h3>
          </div>

          <mat-card class="product-card" *ngFor="let product of products">
            <div class="product-image">
              <img [src]="product.images[0]" [alt]="product.title" onerror="this.src='assets/placeholder.png'">
              <div class="product-badge" *ngIf="!product.inStock">Out of Stock</div>
            </div>
            <mat-card-content class="product-content">
              <div class="product-header">
                  <h3 class="product-title">{{ product.title }}</h3>
                  <span class="product-price">{{ product.price | currency:'LKR ':'symbol':'1.0-0' }}</span>
              </div>
              <p class="product-description">{{ product.description }}</p>
              <mat-chip class="category-chip">{{product.category}}</mat-chip>
            </mat-card-content>
            <mat-card-actions align="end">
                <button mat-raised-button color="primary" 
                    [disabled]="!product.inStock"
                    (click)="openReservationDialog(product)">
                    <mat-icon>shopping_bag</mat-icon>
                    {{ product.inStock ? 'Reserve' : 'Out of Stock' }}
                </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <ng-template #loading>
            <div class="loading-spinner">
                <p>Loading products...</p>
            </div>
        </ng-template>

      </div>
    </section>
  `,
  styles: [`
    :host {
      --primary-color: #0b1f3a;
      --primary-light: #1e3a5f;
      --accent-color: #f4b416;
      --text-primary: #1f2937;
      display: block;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section - Reduced height */
    .hero-section {
      position: relative;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      padding: 60px 0;
      color: white;
      text-align: center;
      margin-bottom: 40px;
    }
    
    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .hero-description {
      font-size: 1.1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Filters */
    .filters-container {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
        overflow-x: auto;
        padding-bottom: 16px;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 32px;
      padding-bottom: 80px;
    }

    .product-card {
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .product-image {
      height: 200px;
      background: #f1f5f9;
      position: relative;
      overflow: hidden;
    }

    .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ef4444;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .product-content {
      padding: 20px;
      flex-grow: 1;
    }

    .product-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
    }

    .product-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.4;
    }

    .product-price {
        font-weight: 800;
        color: var(--accent-color);
        font-size: 1.1rem;
    }

    .product-description {
      color: #6b7280;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .category-chip {
        font-size: 0.8rem;
        background-color: #f3f4f6;
    }

    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        color: #9ca3af;
    }
    
    .no-products mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
    }
  `]
})
export class ShopPageComponent {
  private shopService = inject(ShopService);
  private dialog = inject(MatDialog);

  categories = ['All', 'Tea', 'Spices', 'Handicrafts', 'Clothing', 'Wellness', 'Art'];
  selectedCategory$ = new BehaviorSubject<string>('All');

  products$: Observable<Product[]> = this.selectedCategory$.pipe(
    switchMap(category => this.shopService.getProducts(category))
  );

  selectCategory(category: string) {
    this.selectedCategory$.next(category);
  }

  openReservationDialog(product: Product) {
    this.dialog.open(ReservationDialogComponent, {
      width: '500px',
      data: { product }
    });
  }
}