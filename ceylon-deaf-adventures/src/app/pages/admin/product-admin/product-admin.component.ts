import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ShopService } from '../../../services/shop.service';
import { Product } from '../../../models/product.model';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    AdminNavigationComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <app-admin-navigation title="{{ isEditMode ? 'Edit Product' : 'Add New Product' }}" />

      <div class="container mx-auto p-6 max-w-4xl flex-grow">
        <div class="flex items-center gap-4 mb-6">
            <button mat-icon-button routerLink="/admin/products" class="back-button">
                <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="text-2xl font-bold text-navy-900 m-0">
                {{ isEditMode ? 'Edit Product' : 'Create New Product' }}
            </h1>
        </div>

        <mat-card class="product-card">
            <mat-card-content class="p-6">
                <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
                    
                    <!-- Basic Info Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <mat-form-field appearance="outline" class="w-full">
                            <mat-label>Product Title</mat-label>
                            <input matInput formControlName="title" placeholder="Ex: Handwoven Basket">
                            <mat-error *ngIf="productForm.get('title')?.hasError('required')">Title is required</mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="w-full">
                            <mat-label>Category</mat-label>
                            <mat-select formControlName="category">
                                <mat-option *ngFor="let cat of categories" [value]="cat">
                                    {{cat}}
                                </mat-option>
                            </mat-select>
                            <mat-error *ngIf="productForm.get('category')?.hasError('required')">Category is required</mat-error>
                        </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Description</mat-label>
                        <textarea matInput formControlName="description" rows="5" placeholder="Detailed product description..."></textarea>
                        <mat-error *ngIf="productForm.get('description')?.hasError('required')">Description is required</mat-error>
                    </mat-form-field>

                    <!-- Price & Stock Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <mat-form-field appearance="outline" class="w-full">
                            <mat-label>Price (LKR)</mat-label>
                            <input matInput type="number" formControlName="price" min="0">
                            <mat-error *ngIf="productForm.get('price')?.hasError('required')">Price is required</mat-error>
                            <mat-error *ngIf="productForm.get('price')?.hasError('min')">Price must be positive</mat-error>
                        </mat-form-field>

                        <div class="flex items-center h-[56px]">
                            <mat-slide-toggle formControlName="inStock" color="primary">
                                <span class="text-base ml-2">{{ productForm.get('inStock')?.value ? 'In Stock' : 'Out of Stock' }}</span>
                            </mat-slide-toggle>
                        </div>
                    </div>

                    <!-- Image Section -->
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">Product Image</h3>
                        
                        <div class="flex flex-col gap-4">
                            <!-- File Upload -->
                            <div class="flex items-center gap-4">
                                <button mat-stroked-button type="button" (click)="fileInput.click()" [disabled]="isUploading">
                                    <mat-icon>cloud_upload</mat-icon>
                                    Upload Image
                                </button>
                                <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
                                
                                <span *ngIf="isUploading" class="text-sm text-gray-500">Uploading... {{ uploadProgress }}%</span>
                            </div>

                            <mat-progress-bar *ngIf="isUploading" mode="determinate" [value]="uploadProgress"></mat-progress-bar>

                            <!-- URL Input (fallback/direct) -->
                            <mat-form-field appearance="outline" class="w-full">
                                <mat-label>Image URL</mat-label>
                                <input matInput formControlName="imageUrl" placeholder="https://example.com/image.jpg">
                                <mat-icon matSuffix>link</mat-icon>
                                <mat-hint>Upload an image or enter a direct link</mat-hint>
                                <mat-error *ngIf="productForm.get('imageUrl')?.hasError('required')">Image URL is required</mat-error>
                            </mat-form-field>
                        </div>

                        <div *ngIf="productForm.get('imageUrl')?.value" class="mt-4">
                            <p class="text-xs text-gray-500 mb-2">Preview:</p>
                            <img [src]="productForm.get('imageUrl')?.value" 
                                 alt="Product preview" 
                                 class="h-48 w-full object-cover rounded-md border border-gray-300 bg-white"
                                 (error)="onImageError($event)">
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button mat-button type="button" routerLink="/admin/products" [disabled]="isSaving">
                            Cancel
                        </button>
                        <button mat-flat-button color="primary" type="submit" 
                                [disabled]="productForm.invalid || isSaving"
                                class="action-button">
                            <mat-icon *ngIf="!isSaving">save</mat-icon>
                            <mat-spinner *ngIf="isSaving" diameter="20" class="mr-2"></mat-spinner>
                            {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
                        </button>
                    </div>

                </form>
            </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
        display: block;
    }
    
    .text-navy-900 {
        color: #0b1f3a;
    }

    .back-button {
        color: #0b1f3a;
    }

    .product-card {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border-radius: 12px;
        background: white;
    }

    /* Customizing Material Form Fields to match theme */
    ::ng-deep .mat-mdc-form-field-flex {
        background-color: white !important;
    }

    .action-button {
        background-color: #f4b416 !important; /* Yellow */
        color: #0b1f3a !important; /* Navy */
        font-weight: 600;
        min-width: 140px;
    }

    ::ng-deep .mat-mdc-slide-toggle.mat-primary:not(.mat-disabled) .mdc-switch--selected .mdc-switch__icon {
        color: #f4b416;
    }
    
    ::ng-deep .mat-mdc-slide-toggle.mat-primary:not(.mat-disabled) .mdc-switch--track:checked {
        background-color: #0b1f3a !important;
    }
  `]
})
export class ProductAdminComponent {
  private fb = inject(FormBuilder);
  private shopService = inject(ShopService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    imageUrl: ['', Validators.required],
    inStock: [true]
  });

  isEditMode = false;
  isSaving = false;
  productId: string | null = null;
  imageError = false;
  isUploading = false;
  uploadProgress = 0;

  categories = ['Tea', 'Spices', 'Handicrafts', 'Clothing', 'Wellness', 'Art', 'Souvenirs'];

  constructor() {
    this.route.params.subscribe(async params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        await this.loadProduct(params['id']);
      }
    });
  }

  async loadProduct(id: string) {
    this.shopService.getProduct(id).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.images?.[0] || '',
            inStock: product.inStock
          });
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.showSnackBar('Failed to load product details.', 'error');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onImageError(event: any) {
    this.imageError = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.uploadProgress = 0;

      this.shopService.uploadProductImage(file).subscribe({
        next: (res) => {
          this.uploadProgress = res.progress;
          if (res.downloadURL) {
            this.productForm.patchValue({ imageUrl: res.downloadURL });
            this.isUploading = false;
            this.showSnackBar('Image uploaded successfully!', 'success');
          }
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.isUploading = false;
          this.showSnackBar('Image upload failed.', 'error');
        }
      });
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) return;

    this.isSaving = true;
    const formValue = this.productForm.value;

    // Ensure robust types
    const productData: any = {
      title: formValue.title,
      description: formValue.description,
      price: Number(formValue.price),
      category: formValue.category,
      images: [formValue.imageUrl], // Currently handling single image in UI, stored as array
      inStock: formValue.inStock,
      updatedAt: new Date()
    };

    if (!this.isEditMode) {
      productData.createdAt = new Date();
    }

    try {
      if (this.isEditMode && this.productId) {
        await this.shopService.updateProduct(this.productId, productData);
        this.showSnackBar('Product updated successfully!', 'success');
      } else {
        await this.shopService.addProduct(productData);
        this.showSnackBar('Product created successfully!', 'success');
      }
      this.router.navigate(['/admin/products']);
    } catch (error) {
      console.error('Error saving product:', error);
      this.showSnackBar('Error saving product. Please try again.', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['bg-green-600', 'text-white'] : ['bg-red-600', 'text-white']
    });
  }
}


