import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShopService } from '../../../services/shop.service';
import { Product } from '../../../models/product.model';
import { Observable } from 'rxjs';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>

      <div class="admin-header">
        <div class="header-content">
            <h1 class="admin-title">
            <mat-icon>storefront</mat-icon>
            Products Management
            </h1>
            <p class="admin-subtitle">Manage inventory for the Ceylon Craft Shop.</p>
        </div>
        
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="new">
            <mat-icon>add</mat-icon>
            New Product
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <mat-card class="admin-card">
        <div class="table-container">
            <table mat-table [dataSource]="(products$ | async) || []" class="admin-table">
            
            <!-- Image Column -->
            <ng-container matColumnDef="image">
                <th mat-header-cell *matHeaderCellDef> Image </th>
                <td mat-cell *matCellDef="let product">
                    <div class="image-wrapper">
                        <img [src]="product.images[0]" [alt]="product.title"
                            onerror="this.src='/assets/placeholder.jpg'">
                    </div>
                </td>
            </ng-container>

            <!-- Title Column -->
            <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef> Product Details </th>
                <td mat-cell *matCellDef="let product"> 
                    <div class="product-info">
                        <span class="product-title">{{product.title}}</span>
                         <span class="product-category">
                             <mat-icon>label</mat-icon> {{ product.category }}
                         </span>
                    </div>
                </td>
            </ng-container>

            <!-- Price Column -->
            <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef> Price </th>
                <td mat-cell *matCellDef="let product"> 
                    <span class="price-tag">
                        {{product.price | currency:'LKR ':'symbol':'1.0-0'}} 
                    </span>
                </td>
            </ng-container>

            <!-- Stock Column -->
            <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef> Status </th>
                <td mat-cell *matCellDef="let product">
                    <span class="status-badge" [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
                         <div class="status-dot"></div>
                        {{product.inStock ? 'In Stock' : 'Out of Stock'}}
                    </span>
                </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let product">
                    <div class="action-buttons">
                        <button mat-icon-button [routerLink]="['edit', product.id]" class="action-btn edit-btn" matTooltip="Edit Product">
                            <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button (click)="deleteProduct(product)" class="action-btn delete-btn" matTooltip="Delete Product">
                            <mat-icon>delete_outline</mat-icon>
                        </button>
                    </div>
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="product-row"></tr>
            
            <!-- Empty State Row -->
            <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="6">
                     <div class="empty-state">
                        <mat-icon>inventory_2</mat-icon>
                        <p>No products found.</p>
                     </div>
                </td>
            </tr>
            </table>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
        --primary: #0b1f3a;
        --accent: #f4b416;
        --text: #1f2937;
        --text-light: #6b7280;
        --bg-light: #f3f4f6;
        --card-bg: #ffffff;
        --danger: #ef4444;
        --success: #10b981;
    }

    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* Header */
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      gap: 24px;
      flex-wrap: wrap;
    }

    .admin-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      margin: 0 0 8px 0;
    }

    .admin-title mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: var(--accent);
    }

    .admin-subtitle {
      font-size: 1rem;
      color: var(--text-light);
      margin: 0;
    }

    /* Cards */
    .admin-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      border: 1px solid #e5e7eb;
      background: var(--card-bg);
      overflow: hidden;
    }

    /* Table */
    .table-container {
        overflow-x: auto;
    }

    .admin-table {
      width: 100%;
    }

    .admin-table th.mat-header-cell {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-light);
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
        background-color: #f9fafb;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .admin-table td.mat-cell {
        padding: 16px 24px;
        border-bottom: 1px solid #f3f4f6;
        color: var(--text);
        font-size: 0.95rem;
    }

    .product-row:hover {
        background-color: #f9fafb;
    }
    
    .product-row:last-child td {
        border-bottom: none;
    }

     /* Image */
    .image-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        background-color: #f3f4f6;
    }

    .image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    /* Info */
    .product-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .product-title {
        font-weight: 600;
        color: var(--primary);
        font-size: 1rem;
    }
    
    .product-category {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: var(--text-light);
    }
    
    .product-category mat-icon { font-size: 14px; width: 14px; height: 14px; }

    /* Price tag */
    .price-tag {
        font-weight: 600;
        color: var(--text);
        background: #f3f4f6;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.875rem;
    }

    /* Status */
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }

    .in-stock {
        background-color: #ecfdf5;
        color: #065f46;
    }
    
    .in-stock .status-dot { background-color: #059669; }

    .out-of-stock {
        background-color: #fef2f2;
        color: #991b1b;
    }
    
    .out-of-stock .status-dot { background-color: #dc2626; }

     /* Actions */
    .action-buttons {
        display: flex;
        gap: 4px;
    }

    .action-btn {
        width: 36px;
        height: 36px;
        line-height: 36px;
        border-radius: 8px;
    }
    
    .action-btn mat-icon { font-size: 20px; }

    .edit-btn { color: var(--primary); }
    .edit-btn:hover { background-color: #e0f2fe; }

    .delete-btn { color: var(--danger); opacity: 0.7; }
    .delete-btn:hover { background-color: #fee2e2; opacity: 1; }
    
    .empty-state {
        padding: 48px;
        text-align: center;
        color: var(--text-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }
    
    .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        opacity: 0.5;
    }
  `]
})
export class ProductsListComponent {
  private shopService = inject(ShopService);
  products$: Observable<Product[]> = this.shopService.getProducts();
  displayedColumns: string[] = ['image', 'title', 'price', 'stock', 'actions'];

  async deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      if (product.id) {
        await this.shopService.deleteProduct(product.id);
      }
    }
  }
}
