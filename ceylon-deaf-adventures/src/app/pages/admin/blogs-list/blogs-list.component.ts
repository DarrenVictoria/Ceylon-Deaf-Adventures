import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BlogsService } from '../../../services/blogs.service';
import { FirebaseDebugService } from '../../../services/firebase-debug.service';
import { Blog } from '../../../models/blog';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>
      
      <div class="admin-header">
        <h1 class="admin-title">
          <mat-icon>article</mat-icon>
          Blog Management
        </h1>
        <p class="admin-subtitle">Create and manage blog posts for your website</p>
        
        <div class="header-actions">
          <button mat-stroked-button (click)="testConnection()" color="accent">
            <mat-icon>bug_report</mat-icon>
            Test Connection
          </button>
          <button mat-stroked-button (click)="loadBlogs()" color="primary">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button mat-raised-button color="primary" (click)="createBlog()">
            <mat-icon>add</mat-icon>
            Create New Blog
          </button>
        </div>
      </div>

      <mat-card class="blogs-card" *ngIf="!loading && blogs.length === 0">
        <mat-card-content class="empty-state">
          <mat-icon class="empty-icon">article</mat-icon>
          <h2>No Blog Posts Found</h2>
          <p>Start sharing your stories and experiences by creating your first blog post.</p>
          <button mat-raised-button color="primary" (click)="createBlog()">
            <mat-icon>add</mat-icon>
            Create Your First Blog Post
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card class="blogs-card" *ngIf="loading">
        <mat-card-content class="loading-state">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
          <p>Loading blog posts...</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="blogs-card" *ngIf="!loading && blogs.length > 0">
        <div class="blogs-header">
          <h2>All Blog Posts ({{ blogs.length }})</h2>
          <div class="view-options">
            <button mat-icon-button [class.active]="viewMode === 'table'" (click)="viewMode = 'table'">
              <mat-icon>view_list</mat-icon>
            </button>
            <button mat-icon-button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">
              <mat-icon>grid_view</mat-icon>
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div *ngIf="viewMode === 'table'" class="table-container">
          <table mat-table [dataSource]="blogs" class="blogs-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let blog">
                <div class="blog-image">
                  <img [src]="blog.featuredImage || '/placeholder.png'" [alt]="blog.title">
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let blog">
                <div class="blog-info">
                  <h3>{{ blog.title }}</h3>
                  <p>{{ blog.summary || getExcerpt(blog.content) }}</p>
                  <div class="blog-author">
                    <mat-icon class="author-icon">person</mat-icon>
                    <span>{{ blog.authorName || 'Unknown Author' }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef>Details</th>
              <td mat-cell *matCellDef="let blog">
                <div class="blog-details">
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ formatDate(blog.createdAt) }}</span>
                  </div>
                  <div class="detail-item" *ngIf="blog.publishedAt">
                    <mat-icon>publish</mat-icon>
                    <span>{{ formatDate(blog.publishedAt) }}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>visibility</mat-icon>
                    <span>{{ blog.viewCount || 0 }} views</span>
                  </div>
                  <div class="tags" *ngIf="blog.tags && blog.tags.length > 0">
                    <mat-chip-set>
                      <mat-chip *ngFor="let tag of blog.tags.slice(0, 2)">{{ tag }}</mat-chip>
                    </mat-chip-set>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let blog">
                <div class="status-container">
                  <mat-chip [class]="getStatusClass(blog.status)">
                    <mat-icon>{{ getStatusIcon(blog.status) }}</mat-icon>
                    {{ blog.status | titlecase }}
                  </mat-chip>
                  <mat-chip *ngIf="blog.isFeatured" class="featured-chip">
                    <mat-icon>star</mat-icon>
                    Featured
                  </mat-chip>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let blog">
                <div class="actions">
                  <button mat-icon-button color="primary" (click)="editBlog(blog)" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="toggleStatus(blog)" 
                    [matTooltip]="blog.status === 'published' ? 'Unpublish' : 'Publish'">
                    <mat-icon>{{ blog.status === 'published' ? 'visibility_off' : 'publish' }}</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="toggleFeatured(blog)" 
                    [matTooltip]="blog.isFeatured ? 'Remove from Featured' : 'Add to Featured'">
                    <mat-icon>{{ blog.isFeatured ? 'star' : 'star_border' }}</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteBlog(blog)" matTooltip="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <!-- Grid View -->
        <div *ngIf="viewMode === 'grid'" class="grid-container">
          <div *ngFor="let blog of blogs" class="blog-card">
            <div class="blog-card-image">
              <img [src]="blog.featuredImage || '/placeholder.png'" [alt]="blog.title">
              <div class="blog-card-overlay">
                <mat-chip [class]="getStatusClass(blog.status)">
                  {{ blog.status | titlecase }}
                </mat-chip>
                <mat-chip *ngIf="blog.isFeatured" class="featured-chip">
                  <mat-icon>star</mat-icon>
                </mat-chip>
              </div>
            </div>
            <div class="blog-card-content">
              <h3>{{ blog.title }}</h3>
              <p>{{ blog.summary || getExcerpt(blog.content) }}</p>
              <div class="blog-card-meta">
                <div class="meta-item">
                  <mat-icon>person</mat-icon>
                  <span>{{ blog.authorName || 'Unknown' }}</span>
                </div>
                <div class="meta-item">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ formatDate(blog.createdAt) }}</span>
                </div>
                <div class="meta-item">
                  <mat-icon>visibility</mat-icon>
                  <span>{{ blog.viewCount || 0 }}</span>
                </div>
              </div>
              <div class="blog-card-tags" *ngIf="blog.tags && blog.tags.length > 0">
                <mat-chip-set>
                  <mat-chip *ngFor="let tag of blog.tags.slice(0, 3)">{{ tag }}</mat-chip>
                </mat-chip-set>
              </div>
              <div class="blog-card-actions">
                <button mat-icon-button color="primary" (click)="editBlog(blog)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="toggleStatus(blog)">
                  <mat-icon>{{ blog.status === 'published' ? 'visibility_off' : 'publish' }}</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="toggleFeatured(blog)">
                  <mat-icon>{{ blog.isFeatured ? 'star' : 'star_border' }}</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteBlog(blog)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 32px;
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
      margin: 0 0 24px 0;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .blogs-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .empty-state, .loading-state {
      text-align: center;
      padding: 64px 32px;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .blogs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      margin-bottom: 16px;
    }

    .blogs-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .view-options {
      display: flex;
      gap: 8px;
    }

    .view-options button.active {
      background-color: #2dd4bf;
      color: white;
    }

    .table-container {
      overflow-x: auto;
    }

    .blogs-table {
      width: 100%;
    }

    .blog-image img {
      width: 80px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    .blog-info h3 {
      margin: 0 0 4px 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .blog-info p {
      margin: 0 0 8px 0;
      font-size: 0.875rem;
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .blog-author {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .author-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .blog-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .detail-item mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .tags {
      margin-top: 8px;
    }

    .status-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .published {
      background-color: #dcfce7 !important;
      color: #166534 !important;
    }

    .draft {
      background-color: #fef3c7 !important;
      color: #92400e !important;
    }

    .archived {
      background-color: #f1f5f9 !important;
      color: #475569 !important;
    }

    .featured-chip {
      background-color: #fef3c7 !important;
      color: #f59e0b !important;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .blog-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .blog-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .blog-card-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .blog-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .blog-card-overlay {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .blog-card-content {
      padding: 20px;
    }

    .blog-card-content h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .blog-card-content p {
      margin: 0 0 16px 0;
      font-size: 0.875rem;
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .blog-card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 12px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .meta-item mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .blog-card-tags {
      margin-bottom: 16px;
    }

    .blog-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 24px 16px;
      }

      .admin-title {
        font-size: 2rem;
      }

      .header-actions {
        flex-direction: column;
        align-items: center;
      }

      .blogs-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .grid-container {
        grid-template-columns: 1fr;
        padding: 16px;
      }
    }
  `]
})
export class BlogsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  blogs: Blog[] = [];
  loading = false;
  viewMode: 'table' | 'grid' = 'table';
  displayedColumns: string[] = ['image', 'title', 'details', 'status', 'actions'];

  constructor(
    private blogsService: BlogsService,
    private debugService: FirebaseDebugService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBlogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async testConnection() {
    console.log('Testing Firebase connection from Blogs List...');
    this.debugService.logFirebaseConfig();
    await this.debugService.testFirestoreConnection();
  }

  loadBlogs() {
    this.loading = true;
    this.cdr.markForCheck();

    this.blogsService.listAllBlogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blogs) => {
          console.log('Loaded blogs:', blogs);
          this.blogs = blogs;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading blogs:', error);
          this.snackBar.open('Error loading blogs: ' + error.message, 'Close', { duration: 5000 });
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  createBlog() {
    this.router.navigate(['/admin/blogs/new']);
  }

  editBlog(blog: Blog) {
    this.router.navigate(['/admin/blogs/edit', blog.id]);
  }

  async toggleStatus(blog: Blog) {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      await this.blogsService.updateBlog(blog.id!, { status: newStatus });
      
      // Update local state
      const index = this.blogs.findIndex(b => b.id === blog.id);
      if (index !== -1) {
        this.blogs[index] = { ...this.blogs[index], status: newStatus };
        this.cdr.markForCheck();
      }
      
      this.snackBar.open(
        `Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`, 
        'Close', 
        { duration: 3000 }
      );
    } catch (error: any) {
      this.snackBar.open('Error updating blog: ' + error.message, 'Close', { duration: 5000 });
    }
  }

  async toggleFeatured(blog: Blog) {
    try {
      const newFeatured = !blog.isFeatured;
      await this.blogsService.updateBlog(blog.id!, { isFeatured: newFeatured });
      
      // Update local state
      const index = this.blogs.findIndex(b => b.id === blog.id);
      if (index !== -1) {
        this.blogs[index] = { ...this.blogs[index], isFeatured: newFeatured };
        this.cdr.markForCheck();
      }
      
      this.snackBar.open(
        `Blog ${newFeatured ? 'added to featured' : 'removed from featured'} successfully!`, 
        'Close', 
        { duration: 3000 }
      );
    } catch (error: any) {
      this.snackBar.open('Error updating blog: ' + error.message, 'Close', { duration: 5000 });
    }
  }

  async deleteBlog(blog: Blog) {
    if (!confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await this.blogsService.deleteBlog(blog.id!);
      
      // Update local state
      this.blogs = this.blogs.filter(b => b.id !== blog.id);
      this.cdr.markForCheck();
      
      this.snackBar.open('Blog deleted successfully!', 'Close', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open('Error deleting blog: ' + error.message, 'Close', { duration: 5000 });
    }
  }

  getExcerpt(content: string): string {
    if (!content) return '';
    // Remove HTML tags and get first 150 characters
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    return status;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'published':
        return 'visibility';
      case 'draft':
        return 'edit';
      case 'archived':
        return 'archive';
      default:
        return 'help';
    }
  }
}