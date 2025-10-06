import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { Timestamp } from '@angular/fire/firestore';
import { ToursService } from '../../../services/tours.service';
import { Tour } from '../../../models/tour';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { FirebaseDebugService } from '../../../services/firebase-debug.service';

interface ImageUpload {
  file: File;
  preview: string;
  uploadProgress: number;
  downloadURL?: string;
}

@Component({
  selector: 'app-tour-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>
      <div class="admin-header">
        <h1 class="admin-title">
          <mat-icon>add_circle</mat-icon>
          {{ editMode ? 'Edit Tour' : 'Add New Tour' }}
        </h1>
        <p class="admin-subtitle">
          {{ editMode ? 'Update tour information and images' : 'Create a new accessible tour experience' }}
        </p>
      </div>

      <form [formGroup]="tourForm" (ngSubmit)="onSubmit()" class="tour-form">
        <!-- Basic Information Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>info</mat-icon>
              Basic Information
            </h2>

            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Tour Title</mat-label>
                <input matInput formControlName="title" placeholder="e.g., Mirissa Whale Watching Adventure">
                <mat-icon matSuffix>title</mat-icon>
                <mat-error *ngIf="tourForm.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Tour Type</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="group">Group Tour</mat-option>
                  <mat-option value="private">Private Tour</mat-option>
                  <mat-option value="deaf_guide">Deaf Guide Tour</mat-option>
                  <mat-option value="adventure">Adventure Tour</mat-option>
                </mat-select>
                <mat-icon matSuffix>category</mat-icon>
                <mat-error *ngIf="tourForm.get('type')?.hasError('required')">
                  Type is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Duration (Days)</mat-label>
                <input matInput type="number" formControlName="durationDays" min="1">
                <mat-icon matSuffix>schedule</mat-icon>
                <mat-error *ngIf="tourForm.get('durationDays')?.hasError('required')">
                  Duration is required
                </mat-error>
                <mat-error *ngIf="tourForm.get('durationDays')?.hasError('min')">
                  Must be at least 1 day
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Capacity</mat-label>
                <input matInput type="number" formControlName="capacity" min="1">
                <mat-icon matSuffix>groups</mat-icon>
                <mat-error *ngIf="tourForm.get('capacity')?.hasError('required')">
                  Capacity is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Price</mat-label>
                <input matInput type="number" formControlName="priceDisplay" min="0">
                <mat-icon matSuffix>payments</mat-icon>
                <mat-error *ngIf="tourForm.get('priceDisplay')?.hasError('required')">
                  Price is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Currency</mat-label>
                <mat-select formControlName="currency">
                  <mat-option value="USD">USD ($)</mat-option>
                  <mat-option value="LKR">LKR (Rs)</mat-option>
                  <mat-option value="EUR">EUR (€)</mat-option>
                  <mat-option value="GBP">GBP (£)</mat-option>
                </mat-select>
                <mat-icon matSuffix>attach_money</mat-icon>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Short Description</mat-label>
              <textarea matInput formControlName="shortDescription" rows="2" 
                placeholder="Brief, engaging description (1-2 sentences)"></textarea>
              <mat-icon matSuffix>short_text</mat-icon>
              <mat-error *ngIf="tourForm.get('shortDescription')?.hasError('required')">
                Short description is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Description</mat-label>
              <textarea matInput formControlName="fullDescription" rows="6" 
                placeholder="Detailed tour description"></textarea>
              <mat-icon matSuffix>description</mat-icon>
              <mat-error *ngIf="tourForm.get('fullDescription')?.hasError('required')">
                Full description is required
              </mat-error>
            </mat-form-field>

            <div class="publish-checkbox">
              <mat-checkbox formControlName="published">
                Publish this tour (make it visible to users)
              </mat-checkbox>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Locations Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>place</mat-icon>
              Locations
            </h2>

            <div formArrayName="location" class="array-container">
              <div *ngFor="let location of locations.controls; let i = index" class="array-item">
                <mat-form-field appearance="outline" class="array-field">
                  <mat-label>Location {{ i + 1 }}</mat-label>
                  <input matInput [formControlName]="i" placeholder="e.g., Mirissa">
                  <mat-icon matSuffix>location_on</mat-icon>
                </mat-form-field>
                <button mat-icon-button color="warn" type="button" 
                  (click)="removeLocation(i)" [disabled]="locations.length === 1">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <button mat-stroked-button color="primary" type="button" (click)="addLocation()">
              <mat-icon>add</mat-icon>
              Add Location
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Features Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>star</mat-icon>
              Tour Features
            </h2>

            <div formArrayName="features" class="array-container">
              <div *ngFor="let feature of features.controls; let i = index" class="array-item">
                <mat-form-field appearance="outline" class="array-field">
                  <mat-label>Feature {{ i + 1 }}</mat-label>
                  <input matInput [formControlName]="i" placeholder="e.g., Professional photography">
                  <mat-icon matSuffix>check_circle</mat-icon>
                </mat-form-field>
                <button mat-icon-button color="warn" type="button" 
                  (click)="removeFeature(i)" [disabled]="features.length === 1">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <button mat-stroked-button color="primary" type="button" (click)="addFeature()">
              <mat-icon>add</mat-icon>
              Add Feature
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Accessibility Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>accessible</mat-icon>
              Accessibility Features
            </h2>

            <div formGroupName="accessibility" class="checkbox-grid">
              <mat-checkbox formControlName="visualAlarms">
                <div class="checkbox-content">
                  <mat-icon>visibility</mat-icon>
                  <span>Visual Alarms</span>
                </div>
              </mat-checkbox>

              <mat-checkbox formControlName="staffTrained">
                <div class="checkbox-content">
                  <mat-icon>school</mat-icon>
                  <span>Staff Trained</span>
                </div>
              </mat-checkbox>

              <mat-checkbox formControlName="ramps">
                <div class="checkbox-content">
                  <mat-icon>accessible</mat-icon>
                  <span>Wheelchair Ramps</span>
                </div>
              </mat-checkbox>

              <mat-checkbox formControlName="captionsProvided">
                <div class="checkbox-content">
                  <mat-icon>subtitles</mat-icon>
                  <span>Captions Provided</span>
                </div>
              </mat-checkbox>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Available Dates Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>event</mat-icon>
              Available Dates
            </h2>

            <div formArrayName="nextAvailableDates" class="array-container">
              <div *ngFor="let date of nextAvailableDates.controls; let i = index" class="array-item">
                <mat-form-field appearance="outline" class="array-field">
                  <mat-label>Date {{ i + 1 }}</mat-label>
                  <input matInput [matDatepicker]="picker" [formControlName]="i">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
                <button mat-icon-button color="warn" type="button" 
                  (click)="removeDate(i)" [disabled]="nextAvailableDates.length === 1">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <button mat-stroked-button color="primary" type="button" (click)="addDate()">
              <mat-icon>add</mat-icon>
              Add Date
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Images Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>photo_library</mat-icon>
              Tour Images
            </h2>

            <div class="image-upload-area">
              <input #fileInput type="file" accept="image/*" multiple 
                (change)="onFileSelected($event)" style="display: none;">
              
              <button mat-raised-button color="primary" type="button" 
                (click)="fileInput.click()" [disabled]="isUploading">
                <mat-icon>cloud_upload</mat-icon>
                Select Images
              </button>

              <p class="upload-hint">
                <mat-icon>info</mat-icon>
                Recommended: High-quality images (1920x1080 or higher). First image will be the main tour image.
              </p>
            </div>

            <!-- Image Previews -->
            <div class="images-grid" *ngIf="imageUploads.length > 0 || existingImages.length > 0">
              <!-- Existing images -->
              <div *ngFor="let imageUrl of existingImages; let i = index" class="image-preview">
                <img [src]="imageUrl" [alt]="'Tour image ' + (i + 1)">
                <div class="image-overlay">
                  <span class="image-badge" *ngIf="i === 0">Main</span>
                  <button mat-icon-button color="warn" type="button" 
                    (click)="removeExistingImage(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <!-- New uploads -->
              <div *ngFor="let upload of imageUploads; let i = index" class="image-preview">
                <img [src]="upload.preview" [alt]="'Upload preview ' + (i + 1)">
                <div class="image-overlay">
                  <mat-progress-bar *ngIf="upload.uploadProgress < 100" 
                    mode="determinate" [value]="upload.uploadProgress">
                  </mat-progress-bar>
                  <button mat-icon-button color="warn" type="button" 
                    (click)="removeUpload(i)" [disabled]="isUploading">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Form Actions -->
        <div class="form-actions">
          <button mat-stroked-button type="button" (click)="testFirebaseConnection()" color="accent">
            <mat-icon>bug_report</mat-icon>
            Test Firebase
          </button>
          <button mat-stroked-button type="button" (click)="onCancel()" [disabled]="isSubmitting">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" 
            [disabled]="tourForm.invalid || isSubmitting || isUploading">
            <mat-icon>{{ isSubmitting ? 'hourglass_empty' : 'save' }}</mat-icon>
            {{ isSubmitting ? 'Saving...' : (editMode ? 'Update Tour' : 'Create Tour') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .admin-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .admin-title mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #2dd4bf;
    }

    .admin-subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0;
    }

    .tour-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .form-card mat-card-content {
      padding: 32px !important;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 24px 0;
    }

    .section-title mat-icon {
      color: #2dd4bf;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .array-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .array-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .array-field {
      flex: 1;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .checkbox-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .checkbox-content mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #2dd4bf;
    }

    .publish-checkbox {
      margin-top: 16px;
      padding: 16px;
      background: #f0fdfa;
      border-radius: 12px;
      border: 1px solid #2dd4bf;
    }

    .image-upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      background: #f8fafc;
      margin-bottom: 24px;
    }

    .upload-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }

    .upload-hint mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .image-preview {
      position: relative;
      aspect-ratio: 16/9;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .image-preview:hover .image-overlay {
      opacity: 1;
    }

    .image-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: #2dd4bf;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .form-actions button {
      padding: 12px 32px !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 12px !important;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 24px 16px;
      }

      .admin-title {
        font-size: 2rem;
      }

      .form-card mat-card-content {
        padding: 24px !important;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class TourAdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tourForm!: FormGroup;
  editMode = false;
  editingTourId?: string;
  isSubmitting = false;
  isUploading = false;

  imageUploads: ImageUpload[] = [];
  existingImages: string[] = [];

  // Properly inject all services
  private storage = inject(Storage);
  private fb = inject(FormBuilder);
  private toursService = inject(ToursService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private injector = inject(Injector);
  private debugService = inject(FirebaseDebugService);

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkEditMode() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.editingTourId = params['id'];
        this.loadTourForEdit();
      }
    });
  }

  private async loadTourForEdit() {
    if (!this.editingTourId) return;

    try {
      this.toursService.listTours().pipe(takeUntil(this.destroy$)).subscribe(tours => {
        const tour = tours.find(t => t.id === this.editingTourId);
        if (tour) {
          this.loadTour(tour);
        } else {
          this.snackBar.open('Tour not found', 'Close', { duration: 3000 });
        }
      });
    } catch (error) {
      console.error('Error loading tour for edit:', error);
      this.snackBar.open('Error loading tour', 'Close', { duration: 3000 });
    }
  }

  private initializeForm() {
    this.tourForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['group', Validators.required],
      location: this.fb.array([this.fb.control('', Validators.required)]),
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      fullDescription: ['', [Validators.required, Validators.minLength(50)]],
      durationDays: [1, [Validators.required, Validators.min(1)]],
      priceDisplay: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      capacity: [10, [Validators.required, Validators.min(1)]],
      features: this.fb.array([this.fb.control('', Validators.required)]),
      accessibility: this.fb.group({
        visualAlarms: [false],
        staffTrained: [false],
        ramps: [false],
        captionsProvided: [false]
      }),
      nextAvailableDates: this.fb.array([this.fb.control(new Date())]),
      published: [false]
    });
  }

  get locations() {
    return this.tourForm.get('location') as FormArray;
  }

  get features() {
    return this.tourForm.get('features') as FormArray;
  }

  get nextAvailableDates() {
    return this.tourForm.get('nextAvailableDates') as FormArray;
  }

  addLocation() {
    this.locations.push(this.fb.control('', Validators.required));
  }

  removeLocation(index: number) {
    if (this.locations.length > 1) {
      this.locations.removeAt(index);
    }
  }

  addFeature() {
    this.features.push(this.fb.control('', Validators.required));
  }

  removeFeature(index: number) {
    if (this.features.length > 1) {
      this.features.removeAt(index);
    }
  }

  addDate() {
    this.nextAvailableDates.push(this.fb.control(new Date()));
  }

  removeDate(index: number) {
    if (this.nextAvailableDates.length > 1) {
      this.nextAvailableDates.removeAt(index);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files).slice(0, 10);

    files.forEach(file => {
      if (file.type.startsWith('image/') && file.size < 10 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUploads.push({
            file,
            preview: e.target?.result as string,
            uploadProgress: 0
          });
          this.cdr.markForCheck();
        };
        reader.readAsDataURL(file);
      } else {
        this.snackBar.open('Please select valid image files under 10MB', 'Close', { duration: 3000 });
      }
    });

    input.value = '';
  }

  removeUpload(index: number) {
    this.imageUploads.splice(index, 1);
    this.cdr.markForCheck();
  }

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
    this.cdr.markForCheck();
  }

  private async uploadImages(): Promise<string[]> {
    if (this.imageUploads.length === 0) {
      return this.existingImages;
    }

    // Run in injection context
    return runInInjectionContext(this.injector, async () => {
      this.isUploading = true;
      const uploadedUrls: string[] = [...this.existingImages];

      try {
        for (let i = 0; i < this.imageUploads.length; i++) {
          const upload = this.imageUploads[i];
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2, 15);
          const fileExt = upload.file.name.split('.').pop();
          const fileName = `tours/${timestamp}_${randomId}.${fileExt}`;

          const storageRef = ref(this.storage, fileName);
          const snapshot = await uploadBytes(storageRef, upload.file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          upload.downloadURL = downloadURL;
          upload.uploadProgress = 100;
          uploadedUrls.push(downloadURL);

          this.cdr.markForCheck();
        }
        return uploadedUrls;
      } catch (error) {
        console.error('Error uploading images:', error);
        throw new Error('Failed to upload images: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        this.isUploading = false;
        this.cdr.markForCheck();
      }
    });
  }

  async onSubmit() {
    console.log('Form submission started...');

    if (this.tourForm.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    if (this.imageUploads.length === 0 && this.existingImages.length === 0) {
      this.snackBar.open('Please add at least one image', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    try {
      console.log('Uploading images...');
      const imageUrls = await this.uploadImages();
      console.log('Images uploaded:', imageUrls);

      const formValue = this.tourForm.value;
      const slug = this.generateSlug(formValue.title);
      console.log('Generated slug:', slug);

      // Prepare tour data - ensure all fields are properly formatted
      const tourData = {
        title: formValue.title.trim(),
        slug: slug,
        type: formValue.type,
        location: formValue.location.filter((loc: string) => loc.trim()),
        shortDescription: formValue.shortDescription.trim(),
        fullDescription: formValue.fullDescription.trim(),
        durationDays: Number(formValue.durationDays),
        priceDisplay: Number(formValue.priceDisplay),
        currency: formValue.currency,
        capacity: Number(formValue.capacity),
        images: imageUrls,
        features: formValue.features.filter((feat: string) => feat.trim()),
        accessibility: {
          visualAlarms: Boolean(formValue.accessibility.visualAlarms),
          staffTrained: Boolean(formValue.accessibility.staffTrained),
          ramps: Boolean(formValue.accessibility.ramps),
          captionsProvided: Boolean(formValue.accessibility.captionsProvided)
        },
        nextAvailableDates: formValue.nextAvailableDates.map((date: Date) =>
          Timestamp.fromDate(new Date(date))
        ),
        published: Boolean(formValue.published)
      };

      console.log('Tour data to save:', tourData);

      if (this.editMode && this.editingTourId) {
        console.log('Updating tour...');
        await this.toursService.updateTour(this.editingTourId, tourData);
        this.snackBar.open('Tour updated successfully!', 'Close', { duration: 3000 });
        console.log('Tour updated successfully');
      } else {
        console.log('Creating new tour...');
        const tourId = await this.toursService.createTour(tourData);
        this.snackBar.open('Tour created successfully!', 'Close', { duration: 3000 });
        console.log('Tour created successfully with ID:', tourId);
      }

      this.resetForm();
      this.router.navigate(['/admin/tours']);

    } catch (error: any) {
      console.error('Error saving tour:', error);
      const errorMessage = error.message || 'Error saving tour. Please try again.';
      this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.tourForm.controls).forEach(key => {
      const control = this.tourForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private resetForm() {
    this.tourForm.reset({
      type: 'group',
      currency: 'USD',
      durationDays: 1,
      capacity: 10,
      priceDisplay: 0,
      published: false
    });

    this.clearFormArray(this.locations);
    this.locations.push(this.fb.control('', Validators.required));

    this.clearFormArray(this.features);
    this.features.push(this.fb.control('', Validators.required));

    this.clearFormArray(this.nextAvailableDates);
    this.nextAvailableDates.push(this.fb.control(new Date()));

    this.imageUploads = [];
    this.existingImages = [];
    this.editMode = false;
    this.editingTourId = undefined;
    this.cdr.markForCheck();
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  async testFirebaseConnection() {
    console.log('Starting Firebase connection test...');
    this.debugService.logFirebaseConfig();
    await this.debugService.testFirestoreConnection();
  }

  onCancel() {
    if (this.tourForm.dirty) {
      const confirmClose = confirm('Are you sure you want to cancel? All unsaved changes will be lost.');
      if (!confirmClose) return;
    }
    this.router.navigate(['/admin/tours']);
  }

  loadTour(tour: Tour) {
    this.editMode = true;
    this.editingTourId = tour.id;
    this.existingImages = [...tour.images];

    this.clearFormArray(this.locations);
    this.clearFormArray(this.features);
    this.clearFormArray(this.nextAvailableDates);

    tour.location.forEach(loc => {
      this.locations.push(this.fb.control(loc, Validators.required));
    });

    tour.features.forEach(feat => {
      this.features.push(this.fb.control(feat, Validators.required));
    });

    tour.nextAvailableDates.forEach(date => {
      const dateObj = date instanceof Date ? date :
        (date && typeof date.toDate === 'function') ? date.toDate() : new Date(date);
      this.nextAvailableDates.push(this.fb.control(dateObj));
    });

    this.tourForm.patchValue({
      title: tour.title,
      type: tour.type,
      shortDescription: tour.shortDescription,
      fullDescription: tour.fullDescription,
      durationDays: tour.durationDays,
      priceDisplay: tour.priceDisplay,
      currency: tour.currency,
      capacity: tour.capacity,
      accessibility: tour.accessibility,
      published: tour.published
    });

    this.cdr.markForCheck();
  }
}