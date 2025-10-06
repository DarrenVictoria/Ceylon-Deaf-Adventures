import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { BlogsService } from '../../../services/blogs.service';
import { Blog } from '../../../models/blog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blog-list-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>
      <div class="admin-header">
        <div class="header-content">
          <h1 class="admin-title">
            <mat-icon>article</mat-icon>
            Manage Blogs
          </h1>
          <p class="admin-subtitle">Create, edit, and manage all blog posts</p>
        </div>
        <button mat-raised-button color="primary" (click)="createNewBlog()">
          <mat-icon>add</mat-icon>
          Create New Blog
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p class="loading-text">Loading blogs...</p>
      </div>

      <!-- Blogs List -->
      <div *ngIf="!isLoading && blogs.length > 0" class="blogs-container">
        <mat-card *ngFor="let blog of blogs" class="blog-card">
          <div class="blog-image-container" *ngIf="blog.featuredImage">
            <img 
              [src]="blog.featuredImage" 
              [alt]="blog.title"
              class="blog-image"
              (error)="onImageError($event)"
            >
            <div class="blog-badges">
              <div class="blog-status-badge" [class]="blog.status">
                {{ blog.status | titlecase }}
              </div>
              <div class="featured-badge" *ngIf="blog.isFeatured">
                <mat-icon>star</mat-icon>
                Featured
              </div>
            </div>
          </div>

          <mat-card-content class="blog-content">
            <div class="blog-header">
              <h3 class="blog-title">{{ blog.title }}</h3>
              <div class="blog-meta">
                <div class="meta-item">
                  <mat-icon>visibility</mat-icon>
                  <span>{{ blog.viewCount || 0 }} views</span>
                </div>
                <div class="meta-item" *ngIf="blog.publishedAt">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ formatDate(blog.publishedAt) }}</span>
                </div>
              </div>
            </div>

            <p class="blog-summary" *ngIf="blog.summary">{{ blog.summary }}</p>

            <div class="blog-tags" *ngIf="blog.tags && blog.tags.length > 0">
              <mat-chip-listbox>
                <mat-chip *ngFor="let tag of blog.tags.slice(0, 3)" class="tag-chip">
                  {{ tag }}
                </mat-chip>
                <mat-chip *ngIf="blog.tags.length > 3" class="tag-chip more-tags">
                  +{{ blog.tags.length - 3 }} more
                </mat-chip>
              </mat-chip-listbox>
            </div>

            <div class="blog-actions">
              <button mat-button color="primary" (click)="editBlog(blog)" matTooltip="Edit Blog">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="accent" (click)="togglePublish(blog)" 
                [matTooltip]="blog.status === 'published' ? 'Unpublish Blog' : 'Publish Blog'">
                <mat-icon>{{ blog.status === 'published' ? 'visibility_off' : 'visibility' }}</mat-icon>
                {{ blog.status === 'published' ? 'Unpublish' : 'Publish' }}
              </button>
              <button mat-button color="accent" (click)="toggleFeatured(blog)" 
                [matTooltip]="blog.isFeatured ? 'Remove from Featured' : 'Mark as Featured'">
                <mat-icon>{{ blog.isFeatured ? 'star_border' : 'star' }}</mat-icon>
                {{ blog.isFeatured ? 'Unfeature' : 'Feature' }}
              </button>
              <button mat-button color="warn" (click)="deleteBlog(blog)" matTooltip="Delete Blog">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && blogs.length === 0" class="empty-state">
        <mat-icon class="empty-icon">library_books</mat-icon>
        <h3 class="empty-title">No blogs yet</h3>
        <p class="empty-description">Create your first blog post to get started</p>
        <button mat-raised-button color="primary" (click)="createNewBlog()">
          <mat-icon>add</mat-icon>
          Create Blog
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
      flex-wrap: wrap;
      gap: 24px;
    }

    .header-content {
      flex: 1;
    }

    .admin-title {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 8px 0;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 24px;
    }

    .loading-text {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0;
    }

    .blogs-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .blog-card {
      border-radius: 16px !important;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .blog-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
    }

    .blog-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .blog-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .blog-badges {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .blog-status-badge {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .blog-status-badge.published {
      background: #10b981;
      color: white;
    }

    .blog-status-badge.draft {
      background: #f59e0b;
      color: white;
    }

    .blog-status-badge.archived {
      background: #6b7280;
      color: white;
    }

    .featured-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #fbbf24;
      color: white;
    }

    .featured-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .blog-content {
      padding: 24px !important;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .blog-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .blog-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      line-height: 1.3;
    }

    .blog-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .meta-item mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      color: #2dd4bf;
    }

    .blog-summary {
      color: #6b7280;
      line-height: 1.6;
      font-size: 0.9rem;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .blog-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag-chip {
      background-color: rgba(45, 212, 191, 0.1) !important;
      color: #2dd4bf !important;
      font-size: 0.75rem !important;
      height: 28px !important;
      border-radius: 14px !important;
    }

    .more-tags {
      background-color: rgba(107, 114, 128, 0.1) !important;
      color: #6b7280 !important;
    }

    .blog-actions {
      display: flex;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      flex-wrap: wrap;
    }

    .blog-actions button {
      flex: 1;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      min-width: 80px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 24px;
      text-align: center;
    }

    .empty-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #cbd5e1;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .empty-description {
      font-size: 1.125rem;
      color: #6b7280;
      max-width: 400px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 24px 16px;
      }

      .admin-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .admin-header button {
        width: 100%;
      }

      .admin-title {
        font-size: 2rem;
      }

      .blogs-container {
        grid-template-columns: 1fr;
      }

      .blog-actions {
        flex-direction: column;
      }

      .blog-actions button {
        width: 100%;
      }
    }
  `]
})
export class BlogListAdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  blogs: Blog[] = [];
  isLoading = true;

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadBlogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlogs() {
    this.isLoading = true;
    this.blogsService.listAllBlogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blogs) => {
          this.blogs = blogs;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading blogs:', error);
          this.snackBar.open('Error loading blogs', 'Close', { duration: 3000 });
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  createNewBlog() {
    this.router.navigate(['/admin/blogs/new']);
  }

  editBlog(blog: Blog) {
    this.router.navigate(['/admin/blogs/edit', blog.id]);
  }

  async togglePublish(blog: Blog) {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      await this.blogsService.updateBlog(blog.id!, {
        status: newStatus
      });

      this.snackBar.open(
        `Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
        'Close',
        { duration: 3000 }
      );

      this.loadBlogs();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      this.snackBar.open('Error updating blog', 'Close', { duration: 3000 });
    }
  }

  async toggleFeatured(blog: Blog) {
    try {
      await this.blogsService.updateBlog(blog.id!, {
        isFeatured: !blog.isFeatured
      });

      this.snackBar.open(
        `Blog ${!blog.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        'Close',
        { duration: 3000 }
      );

      this.loadBlogs();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      this.snackBar.open('Error updating blog', 'Close', { duration: 3000 });
    }
  }

  async deleteBlog(blog: Blog) {
    const confirmed = confirm(
      `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await this.blogsService.deleteBlog(blog.id!);
      this.snackBar.open('Blog deleted successfully', 'Close', { duration: 3000 });
      this.loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      this.snackBar.open('Error deleting blog', 'Close', { duration: 3000 });
    }
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/blog-placeholder.jpg';
  }
}