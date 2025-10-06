import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogsService } from '../../../services/blogs.service';
import { Blog } from '../../../models/blog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <!-- Loading State -->
    <div *ngIf="isLoading" class="loading-container">
      <mat-spinner diameter="50"></mat-spinner>
      <p class="loading-text">Loading blog post...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="!isLoading && !blog" class="error-container">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h2 class="error-title">Blog post not found</h2>
      <p class="error-description">The blog post you're looking for doesn't exist or has been removed.</p>
      <button mat-raised-button color="primary" [routerLink]="['/blogs']"  >
        <mat-icon>arrow_back</mat-icon>
        Back to Blogs
      </button>
    </div>

    <!-- Blog Content -->
    <article *ngIf="!isLoading && blog" class="blog-article">
      <!-- Hero Section -->
      <section class="blog-hero" [class.with-image]="blog.featuredImage">
        <div class="hero-background" *ngIf="blog.featuredImage">
          <img [src]="blog.featuredImage" [alt]="blog.title" (error)="onImageError($event)">
          <div class="hero-overlay"></div>
        </div>
        
        <div class="container">
          <div class="breadcrumb">
            <a [routerLink]="['/']" class="breadcrumb-link">Home</a>
            <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
            <a [routerLink]="['/blogs']" class="breadcrumb-link">Blogs</a>
            <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
            <span class="breadcrumb-current">{{ blog.title }}</span>
          </div>

          <div class="hero-content">
            <div class="blog-meta">
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <span>{{ formatDate(blog.publishedAt) }}</span>
              </div>
              <div class="meta-item" *ngIf="blog.authorName">
                <mat-icon>person</mat-icon>
                <span>by {{ blog.authorName }}</span>
              </div>
              <div class="meta-item">
                <mat-icon>visibility</mat-icon>
                <span>{{ blog.viewCount || 0 }} views</span>
              </div>
              <div class="meta-item" *ngIf="blog.tags && blog.tags.length > 0">
                <mat-icon>local_offer</mat-icon>
                <span>{{ blog.tags[0] }}</span>
              </div>
            </div>

            <h1 class="blog-title">{{ blog.title }}</h1>
            
            <p *ngIf="blog.summary" class="blog-summary">{{ blog.summary }}</p>

            <div class="blog-actions">
              <button mat-stroked-button (click)="goBack()" style="color:white;">
                <mat-icon>arrow_back</mat-icon>
                Back to Blogs
              </button>
              <button mat-button (click)="shareArticle()" style="color:white;">
                <mat-icon>share</mat-icon>
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="blog-content-section">
        <div class="container">
          <div class="content-layout">
            <!-- Main Content -->
            <div class="main-content">
              <mat-card class="content-card">
                <mat-card-content>
                  <div class="blog-content" [innerHTML]="getFormattedContent()"></div>
                </mat-card-content>
              </mat-card>

              <!-- Tags Section -->
              <mat-card class="tags-card" *ngIf="blog.tags && blog.tags.length > 0">
                <mat-card-content>
                  <h3 class="section-title">
                    <mat-icon>local_offer</mat-icon>
                    Tags
                  </h3>
                  <div class="tags-container">
                    <mat-chip-listbox>
                      <mat-chip 
                        *ngFor="let tag of blog.tags" 
                        class="tag-chip"
                        [routerLink]="['/blogs']"
                        [queryParams]="{tag: tag}"
                      >
                        {{ tag }}
                      </mat-chip>
                    </mat-chip-listbox>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Navigation -->
              <div class="blog-navigation">
                <button mat-raised-button color="primary" [routerLink]="['/blogs']" >
                  <mat-icon>arrow_back</mat-icon>
                  Back to All Blogs
                </button>
                <button mat-stroked-button color="primary" (click)="shareArticle()">
                  <mat-icon>share</mat-icon>
                  Share This Article
                </button>
              </div>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
              <!-- Author Card -->
              <mat-card class="sidebar-card author-card" *ngIf="blog.authorName">
                <mat-card-content>
                  <div class="author-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <h4 class="author-name">{{ blog.authorName }}</h4>
                  <p class="author-bio">Contributing author at Ceylon Deaf Adventures</p>
                </mat-card-content>
              </mat-card>

              <!-- Stats Card -->
              <mat-card class="sidebar-card stats-card">
                <mat-card-content>
                  <h4 class="card-title">
                    <mat-icon>analytics</mat-icon>
                    Article Stats
                  </h4>
                  <div class="stats-list">
                    <div class="stat-item">
                      <mat-icon>visibility</mat-icon>
                      <span class="stat-label">Views</span>
                      <span class="stat-value">{{ blog.viewCount || 0 }}</span>
                    </div>
                    <div class="stat-item">
                      <mat-icon>schedule</mat-icon>
                      <span class="stat-label">Published</span>
                      <span class="stat-value">{{ formatDate(blog.publishedAt) }}</span>
                    </div>
                    <div class="stat-item" *ngIf="blog.tags && blog.tags.length > 0">
                      <mat-icon>local_offer</mat-icon>
                      <span class="stat-label">Tags</span>
                      <span class="stat-value">{{ blog.tags.length }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Related Articles -->
              <mat-card class="sidebar-card related-card" *ngIf="relatedBlogs && relatedBlogs.length > 0">
                <mat-card-content>
                  <h4 class="card-title">
                    <mat-icon>article</mat-icon>
                    Related Articles
                  </h4>
                  <div class="related-list">
                    <div 
                      *ngFor="let relatedBlog of relatedBlogs" 
                      class="related-item"
                      [routerLink]="['/blogs', relatedBlog.slug]"
                    >
                      <div class="related-image" *ngIf="relatedBlog.featuredImage">
                        <img [src]="relatedBlog.featuredImage" [alt]="relatedBlog.title" (error)="onImageError($event)">
                      </div>
                      <div class="related-content">
                        <h5 class="related-title">{{ relatedBlog.title }}</h5>
                        <p class="related-meta">{{ formatDate(relatedBlog.publishedAt) }}</p>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </aside>
          </div>
        </div>
      </section>
    </article>
  `,
  styles: [`
    /* Global Variables */
    :host {
      --primary-color: #2dd4bf;
      --primary-light: #5eead4;
      --primary-dark: #0f766e;
      --accent-color: #f97316;
      --accent-light: #fed7aa;
      --secondary-color: #6366f1;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --error-color: #ef4444;
      --background-color: #ffffff;
      --surface-color: #f8fafc;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      display: block;
      min-height: 100vh;
    }

    /* Loading & Error States */
    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      padding: 40px 20px;
      gap: 24px;
    }

    .loading-text {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .error-icon {
      font-size: 64px !important;
      color: var(--error-color);
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      text-align: center;
    }

    .error-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 500px;
      text-align: center;
      line-height: 1.6;
      margin: 0;
    }

    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section */
    .blog-hero {
      position: relative;
      padding: 60px 0;
      background: var(--surface-color);
    }

    .blog-hero.with-image {
      padding: 120px 0 80px;
      color: white;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .hero-background img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 32px;
      font-size: 0.875rem;
      position: relative;
      z-index: 2;
    }

    .breadcrumb-link {
      color: inherit;
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .breadcrumb-link:hover {
      opacity: 1;
    }

    .breadcrumb-separator {
      font-size: 1rem !important;
      opacity: 0.6;
    }

    .breadcrumb-current {
      opacity: 0.9;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
    }

    .blog-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      margin-bottom: 24px;
      font-size: 0.875rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: inherit;
      opacity: 0.9;
    }

    .meta-item mat-icon {
      font-size: 1.125rem !important;
      width: 1.125rem;
      height: 1.125rem;
      color: var(--primary-color);
    }

    .blog-hero.with-image .meta-item mat-icon {
      color: var(--primary-light);
    }

    .blog-title {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.1;
      margin: 0 0 24px 0;
      color: inherit;
    }

    .blog-summary {
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0 0 32px 0;
      opacity: 0.9;
      color: inherit;
    }

    .blog-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    /* Content Section */
    .blog-content-section {
      padding: 80px 0;
      background: white;
    }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 48px;
      align-items: start;
    }

    .main-content {
      min-width: 0; /* Prevents grid overflow */
    }

    .content-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
      margin-bottom: 32px;
    }

    .content-card mat-card-content {
      padding: 48px !important;
    }

    .blog-content {
      line-height: 1.8;
      font-size: 1.125rem;
      color: var(--text-primary);
    }

    .blog-content p {
      margin: 0 0 24px 0;
    }

    .blog-content h1,
    .blog-content h2,
    .blog-content h3,
    .blog-content h4,
    .blog-content h5,
    .blog-content h6 {
      margin: 32px 0 16px 0;
      color: var(--text-primary);
      font-weight: 700;
    }

    .blog-content h1 { font-size: 2.25rem; }
    .blog-content h2 { font-size: 1.875rem; }
    .blog-content h3 { font-size: 1.5rem; }
    .blog-content h4 { font-size: 1.25rem; }
    .blog-content h5 { font-size: 1.125rem; }
    .blog-content h6 { font-size: 1rem; }

    .blog-content ul,
    .blog-content ol {
      margin: 0 0 24px 0;
      padding-left: 32px;
    }

    .blog-content li {
      margin-bottom: 8px;
    }

    .blog-content blockquote {
      margin: 32px 0;
      padding: 24px 32px;
      background: var(--surface-color);
      border-left: 4px solid var(--primary-color);
      border-radius: 0 12px 12px 0;
      font-style: italic;
      font-size: 1.25rem;
      color: var(--text-secondary);
    }

    .blog-content img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .blog-content code {
      background: var(--surface-color);
      padding: 4px 8px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      color: var(--text-primary);
    }

    .blog-content pre {
      background: var(--surface-color);
      padding: 24px;
      border-radius: 12px;
      overflow-x: auto;
      margin: 24px 0;
      border: 1px solid #e2e8f0;
    }

    .blog-content pre code {
      background: none;
      padding: 0;
      border-radius: 0;
    }

    /* Tags Card */
    .tags-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 16px 0;
    }

    .section-title mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem !important;
      width: 1.5rem;
      height: 1.5rem;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag-chip {
      background-color: rgba(45, 212, 191, 0.1) !important;
      color: var(--primary-color) !important;
      font-size: 0.875rem !important;
      height: 32px !important;
      border-radius: 16px !important;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tag-chip:hover {
      background-color: rgba(45, 212, 191, 0.2) !important;
      transform: translateY(-1px);
    }

    /* Navigation */
    .blog-navigation {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      padding: 32px 0;
      border-top: 1px solid #e2e8f0;
    }

    /* Sidebar */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .sidebar-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
      position: sticky;
      top: 24px;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 16px 0;
    }

    .card-title mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem !important;
      width: 1.25rem;
      height: 1.25rem;
    }

    /* Author Card */
    .author-card {
      text-align: center;
    }

    .author-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3);
    }

    .author-avatar mat-icon {
      font-size: 2rem !important;
      width: 2rem;
      height: 2rem;
      color: white;
    }

    .author-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px 0;
    }

    .author-bio {
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    /* Stats Card */
    .stats-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .stat-item mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem !important;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      flex: 1;
    }

    .stat-value {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.875rem;
    }

    /* Related Articles */
    .related-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .related-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 12px;
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .related-item:hover {
      background: var(--surface-color);
      transform: translateX(4px);
    }

    .related-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .related-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .related-content {
      flex: 1;
      min-width: 0;
    }

    .related-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 4px 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .related-meta {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 968px) {
      .content-layout {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .sidebar {
        order: -1;
      }

      .sidebar-card {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 16px;
      }

      .blog-hero {
        padding: 40px 0;
      }

      .blog-hero.with-image {
        padding: 80px 0 60px;
      }

      .blog-title {
        font-size: 2.25rem;
      }

      .blog-summary {
        font-size: 1.125rem;
      }

      .content-card mat-card-content {
        padding: 32px 24px !important;
      }

      .blog-content {
        font-size: 1rem;
      }

      .blog-navigation {
        flex-direction: column;
      }

      .breadcrumb-current {
        max-width: 150px;
      }

      .blog-meta {
        gap: 16px;
      }

      .blog-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .blog-title {
        font-size: 1.875rem;
      }

      .blog-meta {
        flex-direction: column;
        gap: 12px;
      }

      .content-card mat-card-content {
        padding: 24px 20px !important;
      }

      .blog-content h1 { font-size: 1.875rem; }
      .blog-content h2 { font-size: 1.5rem; }
      .blog-content h3 { font-size: 1.25rem; }
    }
  `]
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  blog?: Blog;
  relatedBlogs?: Blog[];
  isLoading = true;

  constructor(
    private blogsService: BlogsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadBlog(slug);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlog(slug: string) {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.blogsService.getBlogBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blog) => {
          this.blog = blog;
          this.isLoading = false;

          if (blog) {
            // Increment view count
            this.blogsService.incrementViewCount(blog.id!);

            // Load related blogs
            this.loadRelatedBlogs(blog);
          }

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading blog:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private loadRelatedBlogs(currentBlog: Blog) {
    if (!currentBlog.tags || currentBlog.tags.length === 0) return;

    // Find blogs with similar tags
    this.blogsService.listPublishedBlogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(blogs => {
        this.relatedBlogs = blogs
          .filter(blog =>
            blog.id !== currentBlog.id &&
            blog.tags?.some(tag => currentBlog.tags!.includes(tag))
          )
          .slice(0, 3);

        this.cdr.markForCheck();
      });
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  getFormattedContent(): string {
    if (!this.blog?.content) return '';

    // Simple markdown-like formatting
    let content = this.blog.content;

    // Convert line breaks to paragraphs
    content = content.replace(/\n\n/g, '</p><p>');
    content = '<p>' + content + '</p>';

    // Convert bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert italic text
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert headers
    content = content.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    content = content.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    return content;
  }

  goBack() {
    this.router.navigate(['/blogs']);
  }

  shareArticle() {
    if (!this.blog) return;

    if (navigator.share) {
      navigator.share({
        title: this.blog.title,
        text: this.blog.summary || 'Check out this blog post from Ceylon Deaf Adventures',
        url: window.location.href
      }).catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // You could show a snackbar here
        console.log('URL copied to clipboard');
      });
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/blog-placeholder.jpg';
  }
}