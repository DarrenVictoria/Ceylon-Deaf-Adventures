import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BlogsService } from '../../../services/blogs.service';
import { Blog } from '../../../models/blog';
import { Observable, combineLatest, startWith, Subject, BehaviorSubject } from 'rxjs';
import { map, takeUntil, debounceTime, distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    ReactiveFormsModule
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
              Discover <span class="highlight-text">Stories</span> & Adventures
            </h1>
            <p class="hero-description">
              Read about accessible travel experiences, cultural insights, and inspiring adventures from our community.
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <mat-icon class="stat-icon">article</mat-icon>
                <span class="stat-number">{{ (allBlogs$ | async)?.length || 0 }}</span>
                <span class="stat-label">Blog Posts</span>
              </div>
              <div class="stat-item">
                <mat-icon class="stat-icon">visibility</mat-icon>
                <span class="stat-number">{{ getTotalViews() | async }}</span>
                <span class="stat-label">Total Views</span>
              </div>
              <div class="stat-item">
                <mat-icon class="stat-icon">local_offer</mat-icon>
                <span class="stat-number">{{ (allTags$ | async)?.length || 0 }}</span>
                <span class="stat-label">Topics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <mat-card class="filter-card">
          <mat-card-content class="filter-content">
            <h3 class="filter-title">
              <mat-icon>search</mat-icon>
              Find Blog Posts
            </h3>
            <form [formGroup]="filterForm" class="filter-form">
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Search posts...</mat-label>
                <input matInput formControlName="searchText" placeholder="Enter keywords or topics">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Filter by Tag</mat-label>
                <mat-select formControlName="selectedTag">
                  <mat-option value="">All Topics</mat-option>
                  <mat-option *ngFor="let tag of allTags$ | async" [value]="tag">
                    <mat-icon>local_offer</mat-icon>
                    {{ tag }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </section>

    <!-- Featured Blogs Section -->
    <section class="featured-section" *ngIf="(featuredBlogs$ | async)?.length! > 0">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Stories</h2>
          <p class="section-subtitle">Handpicked articles from our community</p>
        </div>

        <div class="featured-grid">
          <mat-card 
            *ngFor="let blog of featuredBlogs$ | async; trackBy: trackByBlogId" 
            class="featured-card"
            [routerLink]="['/blogs', blog.slug]"
          >
            <div class="featured-image-container" *ngIf="blog.featuredImage">
              <img
                [src]="blog.featuredImage"
                [alt]="blog.title"
                class="featured-image"
                (error)="onImageError($event)"
              />
              <div class="featured-overlay">
                <div class="featured-badge">
                  <mat-icon>star</mat-icon>
                  Featured
                </div>
              </div>
            </div>

            <mat-card-content class="featured-content">
              <div class="blog-meta">
                <div class="meta-item">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ formatDate(blog.publishedAt) }}</span>
                </div>
                <div class="meta-item">
                  <mat-icon>visibility</mat-icon>
                  <span>{{ blog.viewCount || 0 }} views</span>
                </div>
              </div>

              <h3 class="featured-title">{{ blog.title }}</h3>
              <p class="featured-summary">{{ blog.summary || getExcerpt(blog.content) }}</p>

              <div class="blog-tags" *ngIf="blog.tags && blog.tags.length > 0">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let tag of blog.tags.slice(0, 3)" class="tag-chip">
                    {{ tag }}
                  </mat-chip>
                </mat-chip-listbox>
              </div>

              <div class="read-more">
                <span class="read-more-text">Read Full Story</span>
                <mat-icon>arrow_forward</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- All Blogs Section -->
    <section class="blogs-section">
      <div class="container">
        <!-- Loading State -->
        <div *ngIf="isLoading$ | async" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p class="loading-text">Loading blog posts...</p>
        </div>

        <!-- No Results State -->
        <div *ngIf="!(isLoading$ | async) && (filteredBlogs$ | async)?.length === 0" class="no-results">
          <mat-icon class="no-results-icon">library_books</mat-icon>
          <h3 class="no-results-title">No blog posts found</h3>
          <p class="no-results-description">
            Try adjusting your search terms or filter to find interesting stories.
          </p>
          <button mat-raised-button color="primary" (click)="clearFilters()">
            <mat-icon>clear_all</mat-icon>
            Clear Filters
          </button>
        </div>

        <!-- Blogs Grid -->
        <div *ngIf="!(isLoading$ | async) && (filteredBlogs$ | async)?.length! > 0" class="blogs-grid">
          <mat-card 
            *ngFor="let blog of filteredBlogs$ | async; trackBy: trackByBlogId" 
            class="blog-card"
            [routerLink]="['/blogs', blog.slug]"
          >
            <!-- Blog Image -->
            <div class="blog-image-container" *ngIf="blog.featuredImage">
              <img
                [src]="blog.featuredImage"
                [alt]="blog.title"
                class="blog-image"
                (error)="onImageError($event)"
              />
              <div class="blog-overlay">
                <div class="blog-date">
                  {{ formatDate(blog.publishedAt) }}
                </div>
              </div>
            </div>

            <!-- Blog Content -->
            <mat-card-content class="blog-content">
              <div class="blog-header">
                <h3 class="blog-title">{{ blog.title }}</h3>
                <div class="blog-author" *ngIf="blog.authorName">
                  <mat-icon>person</mat-icon>
                  <span>by {{ blog.authorName }}</span>
                </div>
              </div>

              <p class="blog-excerpt">{{ blog.summary || getExcerpt(blog.content) }}</p>

              <div class="blog-tags" *ngIf="blog.tags && blog.tags.length > 0">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let tag of blog.tags.slice(0, 3)" class="tag-chip">
                    {{ tag }}
                  </mat-chip>
                  <mat-chip *ngIf="blog.tags.length > 3" class="tag-chip more-tags">
                    +{{ blog.tags.length - 3 }}
                  </mat-chip>
                </mat-chip-listbox>
              </div>

              <mat-divider class="content-divider"></mat-divider>

              <!-- Blog Footer -->
              <div class="blog-footer">
                <div class="blog-stats">
                  <div class="stat-item">
                    <mat-icon>visibility</mat-icon>
                    <span>{{ blog.viewCount || 0 }}</span>
                  </div>
                  <div class="stat-item" *ngIf="blog.allowComments">
                    <mat-icon>comment</mat-icon>
                    <span>{{ blog.commentCount || 0 }}</span>
                  </div>
                </div>
                <div class="read-more">
                  <span class="read-more-text">Read More</span>
                  <mat-icon>arrow_forward</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>
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
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      min-height: 60vh;
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
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      opacity: 0.1;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 219, 187, 0.4);
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

    .highlight-text {
      color: var(--accent-color);
      background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.25rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 48px;
      animation: fadeInUp 1s ease-out 0.2s both;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
      animation: fadeInUp 1s ease-out 0.4s both;
    }

    .stat-item {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .stat-icon {
      font-size: 32px !important;
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Filters Section */
    .filters-section {
      padding: 80px 0;
      background: linear-gradient(135deg, var(--surface-color), white);
    }

    .filter-card {
      border-radius: 20px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
    }

    .filter-content {
      padding: 32px !important;
    }

    .filter-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 24px;
    }

    .filter-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .filter-field {
      width: 100%;
    }

    /* Featured Section */
    .featured-section {
      padding: 80px 0;
      background: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .section-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }

    .featured-card {
      border-radius: 20px !important;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
      cursor: pointer;
    }

    .featured-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15) !important;
    }

    .featured-image-container {
      position: relative;
      height: 240px;
      overflow: hidden;
    }

    .featured-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .featured-card:hover .featured-image {
      transform: scale(1.05);
    }

    .featured-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 16px;
    }

    .featured-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(251, 191, 36, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 8px 16px;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .featured-badge mat-icon {
      font-size: 18px !important;
      width: 18px;
      height: 18px;
    }

    .featured-content {
      padding: 32px !important;
      display: flex;
      flex-direction: column;
      gap: 16px;
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
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .meta-item mat-icon {
      font-size: 1.125rem !important;
      width: 1.125rem;
      height: 1.125rem;
      color: var(--primary-color);
    }

    .featured-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .featured-summary {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 1rem;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Blogs Section */
    .blogs-section {
      padding: 80px 0;
      background: var(--surface-color);
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
      color: var(--text-secondary);
      margin: 0;
    }

    .no-results {
      text-align: center;
      padding: 80px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .no-results-icon {
      font-size: 64px !important;
      color: var(--text-muted);
    }

    .no-results-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .no-results-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 400px;
      line-height: 1.6;
      margin: 0;
    }

    .blogs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 32px;
    }

    .blog-card {
      border-radius: 20px !important;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      background: white;
    }

    .blog-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12) !important;
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
      transition: transform 0.3s ease;
    }

    .blog-card:hover .blog-image {
      transform: scale(1.05);
    }

    .blog-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 16px;
    }

    .blog-date {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 6px 12px;
      color: var(--text-primary);
      font-size: 0.75rem;
      font-weight: 600;
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
      gap: 8px;
    }

    .blog-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .blog-author {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .blog-author mat-icon {
      font-size: 1rem !important;
      width: 1rem;
      height: 1rem;
      color: var(--primary-color);
    }

    .blog-excerpt {
      color: var(--text-secondary);
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
      color: var(--primary-color) !important;
      font-size: 0.75rem !important;
      height: 28px !important;
      border-radius: 14px !important;
    }

    .more-tags {
      background-color: rgba(107, 114, 128, 0.1) !important;
      color: var(--text-muted) !important;
    }

    .content-divider {
      margin: 8px 0 !important;
    }

    .blog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .blog-stats {
      display: flex;
      gap: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .stat-item mat-icon {
      font-size: 1rem !important;
      width: 1rem;
      height: 1rem;
      color: var(--primary-color);
    }

    .read-more {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .read-more mat-icon {
      font-size: 1rem !important;
      width: 1rem;
      height: 1rem;
      transition: transform 0.2s ease;
    }

    .blog-card:hover .read-more mat-icon {
      transform: translateX(4px);
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

    /* Material Design Overrides */
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-thick {
      border-color: var(--primary-color);
    }

    ::ng-deep .mat-mdc-option .mat-icon {
      margin-right: 12px;
      color: var(--text-secondary);
    }

    ::ng-deep .mat-mdc-chip-listbox .mat-mdc-chip {
      border-radius: 16px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-stats {
        gap: 32px;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .container {
        padding: 0 16px;
      }
      
      .filter-form {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .featured-grid,
      .blogs-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 1.1rem;
      }
      
      .hero-stats {
        flex-direction: column;
        gap: 24px;
      }
      
      .featured-content,
      .blog-content {
        padding: 20px !important;
      }
    }
  `]
})
export class BlogsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading$ = new BehaviorSubject<boolean>(true);

  allBlogs$!: Observable<Blog[]>;
  filteredBlogs$!: Observable<Blog[]>;
  featuredBlogs$!: Observable<Blog[]>;
  allTags$!: Observable<string[]>;
  filterForm!: FormGroup;

  constructor(
    private blogsService: BlogsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.loadBlogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      searchText: [''],
      selectedTag: ['']
    });
  }

  private loadBlogs() {
    console.log('📝 Loading blogs for user page...');
    // Load published blogs
    this.allBlogs$ = this.blogsService.listPublishedBlogs().pipe(
      tap((blogs: Blog[]) => {
        console.log('📝 Blogs received in user component:', blogs.length);
        console.log('📝 Blog titles:', blogs.map((b: Blog) => b.title));
      }),
      shareReplay(1),
      takeUntil(this.destroy$)
    );

    // Get featured blogs
    this.featuredBlogs$ = this.blogsService.getFeaturedBlogs(3).pipe(
      shareReplay(1)
    );

    // Extract all tags
    this.allTags$ = this.blogsService.getAllTags().pipe(
      shareReplay(1)
    );

    // Set up filtered blogs with debouncing
    this.filteredBlogs$ = combineLatest([
      this.allBlogs$,
      this.filterForm.valueChanges.pipe(
        startWith(this.filterForm.value),
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
    ]).pipe(
      map(([blogs, filters]) => this.filterBlogs(blogs, filters)),
      shareReplay(1)
    );

    // Handle loading state
    this.allBlogs$.subscribe(() => {
      this.isLoading$.next(false);
    });
  }

  private filterBlogs(blogs: Blog[], filters: any): Blog[] {
    return blogs.filter(blog => {
      // Search filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        if (!blog.title.toLowerCase().includes(searchLower) &&
          !blog.summary?.toLowerCase().includes(searchLower) &&
          !blog.content.toLowerCase().includes(searchLower) &&
          !blog.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      // Tag filter
      if (filters.selectedTag && 
        !blog.tags?.some(tag => tag.toLowerCase() === filters.selectedTag.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  trackByBlogId(index: number, blog: Blog): string {
    return blog.id || index.toString();
  }

  clearFilters() {
    this.filterForm.reset({
      searchText: '',
      selectedTag: ''
    });
  }

  getTotalViews(): Observable<number> {
    return this.allBlogs$.pipe(
      map(blogs => blogs.reduce((total, blog) => total + (blog.viewCount || 0), 0))
    );
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

  getExcerpt(content: string, maxLength: number = 150): string {
    if (!content) return '';
    const cleanContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + '...'
      : cleanContent;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/blog-placeholder.jpg';
  }

  /**
   * Debug method to check blogs
   */
  debugBlogs(): void {
    console.log('🔧 Starting blogs debug...');
    this.blogsService.debugBlogStatuses().subscribe();
    
    // Also check what the current user blogs observable has
    this.allBlogs$.subscribe(blogs => {
      console.log('🔧 Current user blogs:', blogs);
    });
  }
}
