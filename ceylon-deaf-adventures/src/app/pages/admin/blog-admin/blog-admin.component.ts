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
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { BlogsService } from '../../../services/blogs.service';
import { Blog, createBlog, slugify } from '../../../models/blog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';

interface ImageUpload {
  file: File;
  preview: string;
  uploadProgress: number;
  downloadURL?: string;
}

@Component({
  selector: 'app-blog-admin',
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
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>
      <div class="admin-header">
        <h1 class="admin-title">
          <mat-icon>{{ editMode ? 'edit' : 'add_circle' }}</mat-icon>
          {{ editMode ? 'Edit Blog Post' : 'Create New Blog Post' }}
        </h1>
        <p class="admin-subtitle">
          {{ editMode ? 'Update blog post content and settings' : 'Create engaging content for your readers' }}
        </p>
      </div>

      <form [formGroup]="blogForm" (ngSubmit)="onSubmit()" class="blog-form">
        <!-- Basic Information Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>info</mat-icon>
              Basic Information
            </h2>

            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Blog Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter a compelling title">
                <mat-icon matSuffix>title</mat-icon>
                <mat-error *ngIf="blogForm.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
                <mat-error *ngIf="blogForm.get('title')?.hasError('minlength')">
                  Title must be at least 5 characters
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL Slug</mat-label>
                <input matInput formControlName="slug" placeholder="auto-generated-from-title">
                <mat-icon matSuffix>link</mat-icon>
                <mat-hint>Leave empty to auto-generate from title</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Summary</mat-label>
                <textarea matInput formControlName="summary" rows="3" 
                  placeholder="Brief summary that appears in blog listings"></textarea>
                <mat-icon matSuffix>short_text</mat-icon>
                <mat-hint>Optional but recommended for SEO</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="draft">
                    <mat-icon>edit</mat-icon>
                    Draft
                  </mat-option>
                  <mat-option value="published">
                    <mat-icon>visibility</mat-icon>
                    Published
                  </mat-option>
                  <mat-option value="archived">
                    <mat-icon>archive</mat-icon>
                    Archived
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>flag</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Author Name</mat-label>
                <input matInput formControlName="authorName" placeholder="Author display name">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <div class="checkbox-container">
                <mat-checkbox formControlName="isFeatured">
                  <div class="checkbox-content">
                    <mat-icon>star</mat-icon>
                    <span>Feature this blog post</span>
                  </div>
                </mat-checkbox>

                <mat-checkbox formControlName="allowComments">
                  <div class="checkbox-content">
                    <mat-icon>comment</mat-icon>
                    <span>Allow comments</span>
                  </div>
                </mat-checkbox>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Content Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>description</mat-icon>
              Blog Content
            </h2>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Blog Content</mat-label>
              <textarea matInput formControlName="content" rows="12" 
                placeholder="Write your blog content here... (Markdown supported)"></textarea>
              <mat-icon matSuffix>description</mat-icon>
              <mat-error *ngIf="blogForm.get('content')?.hasError('required')">
                Content is required
              </mat-error>
              <mat-error *ngIf="blogForm.get('content')?.hasError('minlength')">
                Content must be at least 100 characters
              </mat-error>
              <mat-hint>You can use Markdown formatting</mat-hint>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Tags Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>tag</mat-icon>
              Tags
            </h2>

            <div formArrayName="tags" class="array-container">
              <div *ngFor="let tag of tags.controls; let i = index" class="array-item">
                <mat-form-field appearance="outline" class="array-field">
                  <mat-label>Tag {{ i + 1 }}</mat-label>
                  <input matInput [formControlName]="i" placeholder="e.g., travel, culture">
                  <mat-icon matSuffix>local_offer</mat-icon>
                </mat-form-field>
                <button mat-icon-button color="warn" type="button" 
                  (click)="removeTag(i)" [disabled]="tags.length === 1">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <button mat-stroked-button color="primary" type="button" (click)="addTag()">
              <mat-icon>add</mat-icon>
              Add Tag
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Featured Image Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>image</mat-icon>
              Featured Image
            </h2>

            <div class="image-upload-area">
              <input #fileInput type="file" accept="image/*" 
                (change)="onFileSelected($event)" style="display: none;">
              
              <button mat-raised-button color="primary" type="button" 
                (click)="fileInput.click()" [disabled]="isUploading">
                <mat-icon>cloud_upload</mat-icon>
                Select Featured Image
              </button>

              <p class="upload-hint">
                <mat-icon>info</mat-icon>
                Recommended: High-quality image (1200x600 or 2:1 aspect ratio)
              </p>
            </div>

            <!-- Image Preview -->
            <div class="image-preview-container" *ngIf="imageUpload || existingImage">
              <!-- Existing image -->
              <div *ngIf="existingImage && !imageUpload" class="image-preview">
                <img [src]="existingImage" alt="Current featured image">
                <div class="image-overlay">
                  <button mat-icon-button color="warn" type="button" 
                    (click)="removeExistingImage()">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <!-- New upload -->
              <div *ngIf="imageUpload" class="image-preview">
                <img [src]="imageUpload.preview" alt="Upload preview">
                <div class="image-overlay">
                  <mat-progress-bar *ngIf="imageUpload.uploadProgress < 100" 
                    mode="determinate" [value]="imageUpload.uploadProgress">
                  </mat-progress-bar>
                  <button mat-icon-button color="warn" type="button" 
                    (click)="removeUpload()" [disabled]="isUploading">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- SEO Card -->
        <mat-card class="form-card">
          <mat-card-content>
            <h2 class="section-title">
              <mat-icon>search</mat-icon>
              SEO & Meta Information
            </h2>

            <div class="form-grid" formGroupName="meta">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SEO Title</mat-label>
                <input matInput formControlName="seoTitle" placeholder="SEO optimized title">
                <mat-icon matSuffix>title</mat-icon>
                <mat-hint>Leave empty to use blog title</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SEO Description</mat-label>
                <textarea matInput formControlName="seoDescription" rows="2" 
                  placeholder="Description that appears in search results"></textarea>
                <mat-icon matSuffix>description</mat-icon>
                <mat-hint>Recommended: 150-160 characters</mat-hint>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Admin Notes</mat-label>
              <textarea matInput formControlName="adminNotes" rows="2" 
                placeholder="Internal notes (not visible to readers)"></textarea>
              <mat-icon matSuffix>note</mat-icon>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Form Actions -->
        <div class="form-actions">
          <button mat-stroked-button type="button" (click)="onCancel()" [disabled]="isSubmitting">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-stroked-button type="button" (click)="saveDraft()" 
            [disabled]="blogForm.invalid || isSubmitting">
            <mat-icon>save</mat-icon>
            Save Draft
          </button>
          <button mat-raised-button color="primary" type="submit" 
            [disabled]="blogForm.invalid || isSubmitting || isUploading">
            <mat-icon>{{ isSubmitting ? 'hourglass_empty' : 'publish' }}</mat-icon>
            {{ isSubmitting ? 'Saving...' : (editMode ? 'Update Blog' : 'Publish Blog') }}
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

    .blog-form {
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

    .checkbox-container {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
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

    .image-preview-container {
      display: flex;
      justify-content: center;
    }

    .image-preview {
      position: relative;
      max-width: 400px;
      aspect-ratio: 2/1;
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
export class BlogAdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  blogForm!: FormGroup;
  editMode = false;
  editingBlogId?: string;
  isSubmitting = false;
  isUploading = false;

  imageUpload?: ImageUpload;
  existingImage?: string;

  // Properly inject all services
  private storage = inject(Storage);
  private fb = inject(FormBuilder);
  private blogsService = inject(BlogsService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private injector = inject(Injector);

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
        this.editingBlogId = params['id'];
        this.loadBlogForEdit();
      }
    });
  }

  private async loadBlogForEdit() {
    if (!this.editingBlogId) return;

    try {
      this.blogsService.getBlogById(this.editingBlogId).pipe(takeUntil(this.destroy$)).subscribe(blog => {
        if (blog) {
          this.loadBlog(blog);
        } else {
          this.snackBar.open('Blog not found', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/blogs']);
        }
      });
    } catch (error) {
      console.error('Error loading blog for edit:', error);
      this.snackBar.open('Error loading blog', 'Close', { duration: 3000 });
    }
  }

  private initializeForm() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      slug: [''],
      summary: [''],
      content: ['', [Validators.required, Validators.minLength(100)]],
      status: ['draft', Validators.required],
      authorName: ['', Validators.required],
      authorId: ['admin'], // Default author ID
      tags: this.fb.array([this.fb.control('')]),
      isFeatured: [false],
      allowComments: [true],
      meta: this.fb.group({
        seoTitle: [''],
        seoDescription: ['']
      }),
      adminNotes: ['']
    });

    // Auto-generate slug from title
    this.blogForm.get('title')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(title => {
      if (title && !this.editMode) {
        const slug = slugify(title);
        this.blogForm.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  get tags() {
    return this.blogForm.get('tags') as FormArray;
  }

  addTag() {
    this.tags.push(this.fb.control(''));
  }

  removeTag(index: number) {
    if (this.tags.length > 1) {
      this.tags.removeAt(index);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) { // 5MB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUpload = {
          file,
          preview: e.target?.result as string,
          uploadProgress: 0
        };
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('Please select a valid image file under 5MB', 'Close', { duration: 3000 });
    }

    input.value = '';
  }

  removeUpload() {
    this.imageUpload = undefined;
    this.cdr.markForCheck();
  }

  removeExistingImage() {
    this.existingImage = undefined;
    this.cdr.markForCheck();
  }

  private async uploadImage(): Promise<string | undefined> {
    if (!this.imageUpload) {
      return this.existingImage;
    }

    return runInInjectionContext(this.injector, async () => {
      this.isUploading = true;

      try {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const fileExt = this.imageUpload!.file.name.split('.').pop();
        const fileName = `blogs/${timestamp}_${randomId}.${fileExt}`;

        const storageRef = ref(this.storage, fileName);
        const snapshot = await uploadBytes(storageRef, this.imageUpload!.file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        this.imageUpload!.downloadURL = downloadURL;
        this.imageUpload!.uploadProgress = 100;
        this.cdr.markForCheck();

        return downloadURL;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        this.isUploading = false;
        this.cdr.markForCheck();
      }
    });
  }

  async onSubmit() {
    if (this.blogForm.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    await this.saveBlog('published');
  }

  async saveDraft() {
    if (this.blogForm.get('title')?.invalid || this.blogForm.get('content')?.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open('Title and content are required', 'Close', { duration: 3000 });
      return;
    }

    await this.saveBlog('draft');
  }

  private async saveBlog(status: 'draft' | 'published') {
    this.isSubmitting = true;
    this.cdr.markForCheck();

    try {
      const featuredImage = await this.uploadImage();

      const formValue = this.blogForm.value;
      const blogData = {
        title: formValue.title.trim(),
        slug: formValue.slug || slugify(formValue.title),
        summary: formValue.summary?.trim() || '',
        content: formValue.content.trim(),
        status,
        authorId: formValue.authorId,
        authorName: formValue.authorName.trim(),
        tags: formValue.tags.filter((tag: string) => tag.trim()).map((tag: string) => tag.trim()),
        isFeatured: Boolean(formValue.isFeatured),
        allowComments: Boolean(formValue.allowComments),
        featuredImage: featuredImage || '',
        meta: {
          seoTitle: formValue.meta.seoTitle?.trim() || '',
          seoDescription: formValue.meta.seoDescription?.trim() || ''
        },
        adminNotes: formValue.adminNotes?.trim() || '',
        updatedAt: serverTimestamp()
      };

      if (this.editMode && this.editingBlogId) {
        await this.blogsService.updateBlog(this.editingBlogId, blogData);
        this.snackBar.open(`Blog ${status === 'published' ? 'published' : 'saved'} successfully!`, 'Close', { duration: 3000 });
      } else {
        const blogId = await this.blogsService.createBlog({
          ...blogData,
          createdAt: serverTimestamp()
        });
        this.snackBar.open(`Blog ${status === 'published' ? 'published' : 'created'} successfully!`, 'Close', { duration: 3000 });
      }

      this.router.navigate(['/admin/blogs']);

    } catch (error: any) {
      console.error('Error saving blog:', error);
      const errorMessage = error.message || 'Error saving blog. Please try again.';
      this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.blogForm.controls).forEach(key => {
      const control = this.blogForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    if (this.blogForm.dirty) {
      const confirmClose = confirm('Are you sure you want to cancel? All unsaved changes will be lost.');
      if (!confirmClose) return;
    }
    this.router.navigate(['/admin/blogs']);
  }

  loadBlog(blog: Blog) {
    this.editMode = true;
    this.editingBlogId = blog.id;
    this.existingImage = blog.featuredImage;

    // Clear existing tags and populate with blog tags
    this.clearFormArray(this.tags);
    if (blog.tags && blog.tags.length > 0) {
      blog.tags.forEach(tag => {
        this.tags.push(this.fb.control(tag));
      });
    } else {
      this.tags.push(this.fb.control(''));
    }

    this.blogForm.patchValue({
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary || '',
      content: blog.content,
      status: blog.status,
      authorName: blog.authorName || '',
      authorId: blog.authorId,
      isFeatured: blog.isFeatured || false,
      allowComments: blog.allowComments !== undefined ? blog.allowComments : true,
      meta: {
        seoTitle: blog.meta?.seoTitle || '',
        seoDescription: blog.meta?.seoDescription || ''
      },
      adminNotes: blog.adminNotes || ''
    });

    this.cdr.markForCheck();
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
}