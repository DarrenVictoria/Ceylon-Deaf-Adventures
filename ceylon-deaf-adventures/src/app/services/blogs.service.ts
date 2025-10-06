import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, shareReplay, catchError, tap } from 'rxjs/operators';
import { where, orderBy, query, serverTimestamp } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { Blog, createBlog, validateBlog } from '../models/blog';

@Injectable({ providedIn: 'root' })
export class BlogsService {
    private blogsCache$ = new BehaviorSubject<Blog[] | null>(null);
    private cacheTimestamp = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    private fs = inject(FirestoreService);

    constructor() {
        this.preloadBlogs();
    }

    private preloadBlogs(): void {
        this.fetchBlogsFromFirestore().subscribe({
            next: (blogs) => {
                this.blogsCache$.next(blogs);
                this.cacheTimestamp = Date.now();
            },
            error: (error) => console.error('Failed to preload blogs:', error)
        });
    }

    listBlogs(filters?: { status?: string; featured?: boolean }): Observable<Blog[]> {
        const now = Date.now();
        const isCacheValid = this.blogsCache$.value && (now - this.cacheTimestamp < this.CACHE_DURATION);

        if (isCacheValid && this.blogsCache$.value) {
            return of(this.applyClientSideFilters(this.blogsCache$.value, filters));
        }

        return this.fetchBlogsFromFirestore().pipe(
            tap(blogs => {
                this.blogsCache$.next(blogs);
                this.cacheTimestamp = now;
            }),
            map(blogs => this.applyClientSideFilters(blogs, filters)),
            catchError(error => {
                console.error('Error fetching blogs:', error);
                return of([]);
            }),
            shareReplay(1)
        );
    }

    listPublishedBlogs(): Observable<Blog[]> {
        console.log('📝 Fetching published blogs from Firestore...');
        return this.fs.collection<Blog>('blogs').pipe(
            map(blogs => {
                console.log('📝 All blogs from Firestore:', blogs.length);
                console.log('📝 Blogs data:', blogs.map(b => ({ id: b.id, title: b.title, status: b.status })));
                
                // Filter published blogs on the client side
                const publishedBlogs = blogs.filter(blog => {
                    // Handle both exact match and flexible status checking
                    const statusValue = blog.status as any;
                    const isPublished = statusValue === 'published' || statusValue === 1 || statusValue === true;
                    console.log(`📖 Blog "${blog.title}" - status: ${statusValue} (${typeof statusValue}) -> isPublished: ${isPublished}`);
                    return isPublished;
                }).sort((a, b) => {
                    const aTime = a.publishedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
                    const bTime = b.publishedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
                    return bTime.getTime() - aTime.getTime();
                });
                
                console.log('✅ Published blogs for user view:', publishedBlogs.length);
                return publishedBlogs;
            }),
            catchError(error => {
                console.error('Error fetching published blogs:', error);
                return of([]);
            })
        );
    }

    listAllBlogs(): Observable<Blog[]> {
        return this.fs.collection<Blog>('blogs', ref => 
            query(ref, orderBy('createdAt', 'desc'))
        ).pipe(
            catchError(error => {
                console.error('Error fetching all blogs:', error);
                return of([]);
            })
        );
    }

    private fetchBlogsFromFirestore(): Observable<Blog[]> {
        return this.fs.collection<Blog>('blogs', ref => 
            query(ref, orderBy('createdAt', 'desc'))
        ).pipe(
            catchError(error => {
                console.error('Firestore error:', error);
                return of([]);
            })
        );
    }

    private applyClientSideFilters(blogs: Blog[], filters?: { status?: string; featured?: boolean }): Blog[] {
        if (!filters || !blogs.length) return blogs;
        return blogs.filter(blog => {
            if (filters.status && blog.status !== filters.status) return false;
            if (filters.featured !== undefined && blog.isFeatured !== filters.featured) return false;
            return true;
        });
    }

    getBlogBySlug(slug: string): Observable<Blog | undefined> {
        const cachedBlogs = this.blogsCache$.value;
        if (cachedBlogs) {
            const cachedBlog = cachedBlogs.find(blog => blog.slug === slug);
            if (cachedBlog) return of(cachedBlog);
        }

        return this.fs.collection<Blog>('blogs', ref =>
            query(ref, where('slug', '==', slug))
        ).pipe(
            map(blogs => blogs[0]),
            catchError(error => {
                console.error('Error fetching blog by slug:', error);
                return of(undefined);
            })
        );
    }

    getBlogById(id: string): Observable<Blog | undefined> {
        return this.fs.doc<Blog>(`blogs/${id}`).pipe(
            catchError(error => {
                console.error('Error fetching blog by id:', error);
                return of(undefined);
            })
        );
    }

    async createBlog(blogData: Partial<Blog>): Promise<string> {
        try {
            // Validate blog data
            const errors = validateBlog(blogData);
            if (errors.length > 0) {
                throw new Error('Blog validation failed: ' + errors.join(', '));
            }

            // Create blog with defaults - ensure published status if not specified
            const blog = createBlog({
                ...blogData,
                // Default to published if status not specified
                status: blogData.status || 'published',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                publishedAt: blogData.status === 'published' || !blogData.status ? serverTimestamp() : null,
            });

            console.log('Creating blog in Firestore:', blog);
            const blogId = await this.fs.create('blogs', blog);
            console.log('Blog created with ID:', blogId);
            
            this.invalidateCache();
            return blogId;
        } catch (error: any) {
            console.error('Error creating blog:', error);
            throw new Error('Failed to create blog: ' + (error.message || 'Unknown error'));
        }
    }

    async updateBlog(id: string, changes: Partial<Blog>): Promise<void> {
        try {
            const updateData = {
                ...changes,
                updatedAt: serverTimestamp(),
            };

            // If publishing for the first time, set publishedAt
            if (changes.status === 'published') {
                const currentBlog = await this.getBlogById(id).toPromise();
                if (currentBlog && currentBlog.status !== 'published') {
                    updateData.publishedAt = serverTimestamp();
                }
            }

            console.log('Updating blog in Firestore:', id, updateData);
            await this.fs.update(`blogs/${id}`, updateData);
            this.invalidateCache();
        } catch (error: any) {
            console.error('Error updating blog:', error);
            throw new Error('Failed to update blog: ' + (error.message || 'Unknown error'));
        }
    }

    async deleteBlog(id: string): Promise<void> {
        try {
            await this.fs.delete(`blogs/${id}`);
            this.invalidateCache();
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    }

    async incrementViewCount(id: string): Promise<void> {
        try {
            const blog = await this.getBlogById(id).toPromise();
            if (blog) {
                await this.fs.update(`blogs/${id}`, {
                    viewCount: (blog.viewCount || 0) + 1,
                    updatedAt: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error incrementing view count:', error);
            // Don't throw - view count increment shouldn't fail the page load
        }
    }

    getFeaturedBlogs(limit: number = 3): Observable<Blog[]> {
        return this.fs.collection<Blog>('blogs', ref =>
            query(
                ref,
                where('status', '==', 'published'),
                where('isFeatured', '==', true),
                orderBy('publishedAt', 'desc')
            )
        ).pipe(
            map(blogs => blogs.slice(0, limit)),
            catchError(error => {
                console.error('Error fetching featured blogs:', error);
                return of([]);
            })
        );
    }

    getRecentBlogs(limit: number = 5): Observable<Blog[]> {
        return this.fs.collection<Blog>('blogs', ref =>
            query(
                ref,
                where('status', '==', 'published'),
                orderBy('publishedAt', 'desc')
            )
        ).pipe(
            map(blogs => blogs.slice(0, limit)),
            catchError(error => {
                console.error('Error fetching recent blogs:', error);
                return of([]);
            })
        );
    }

    searchBlogs(searchTerm: string): Observable<Blog[]> {
        if (!searchTerm.trim()) {
            return this.listPublishedBlogs();
        }

        return this.listPublishedBlogs().pipe(
            map(blogs => blogs.filter(blog => 
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            ))
        );
    }

    getBlogsByTag(tag: string): Observable<Blog[]> {
        return this.listPublishedBlogs().pipe(
            map(blogs => blogs.filter(blog => 
                blog.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
            ))
        );
    }

    getAllTags(): Observable<string[]> {
        return this.listPublishedBlogs().pipe(
            map(blogs => {
                const allTags = blogs.flatMap(blog => blog.tags || []);
                return [...new Set(allTags)].sort();
            })
        );
    }

    // Debug method to check blog statuses
    debugBlogStatuses(): Observable<any> {
        console.log('🔧 Debug: Checking all blogs and their status...');
        return this.fs.collection<Blog>('blogs').pipe(
            map(blogs => {
                const summary = {
                    total: blogs.length,
                    published: blogs.filter(b => b.status === 'published').length,
                    draft: blogs.filter(b => b.status === 'draft').length,
                    other: blogs.filter(b => b.status !== 'published' && b.status !== 'draft').length,
                    blogs: blogs.map(b => ({
                        id: b.id,
                        title: b.title,
                        status: b.status,
                        statusType: typeof b.status
                    }))
                };
                console.log('🔧 Blogs debug summary:', summary);
                return summary;
            })
        );
    }

    private invalidateCache(): void {
        this.cacheTimestamp = 0;
        this.blogsCache$.next(null);
        this.preloadBlogs();
    }
}