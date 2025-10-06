import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, shareReplay, catchError, tap, retry, timeout, switchMap } from 'rxjs/operators';
import { where, orderBy, query } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { Tour } from '../models/tour';

@Injectable({ providedIn: 'root' })
export class ToursService {
    private toursCache$ = new BehaviorSubject<Tour[] | null>(null);
    private cacheTimestamp = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000;
    private readonly CONNECTION_TIMEOUT = 15000; // 15 seconds

    private fs = inject(FirestoreService);

    constructor() {
        // Wait for Firestore to be ready before preloading
        setTimeout(() => {
            this.preloadToursWhenReady();
        }, 500);
    }

    private async preloadToursWhenReady(): Promise<void> {
        try {
            if (!this.fs.isReady()) {
                await this.fs.waitForConnection(10000);
            }
            this.preloadTours();
        } catch (error) {
            console.warn('Could not preload tours, Firestore not ready:', error);
            // Try again in 5 seconds
            setTimeout(() => this.preloadToursWhenReady(), 5000);
        }
    }

    private preloadTours(): void {
        this.fetchToursFromFirestore().subscribe({
            next: (tours) => {
                this.toursCache$.next(tours);
                this.cacheTimestamp = Date.now();
            },
            error: (error) => console.error('Failed to preload tours:', error)
        });
    }

    listTours(filters?: any): Observable<Tour[]> {
        const now = Date.now();
        const isCacheValid = this.toursCache$.value && (now - this.cacheTimestamp < this.CACHE_DURATION);

        if (isCacheValid && this.toursCache$.value) {
            return of(this.applyClientSideFilters(this.toursCache$.value, filters));
        }

        return this.fetchToursFromFirestore().pipe(
            tap(tours => {
                this.toursCache$.next(tours);
                this.cacheTimestamp = now;
            }),
            map(tours => this.applyClientSideFilters(tours, filters)),
            catchError(error => {
                console.error('Error fetching tours:', error);
                return of([]);
            }),
            shareReplay(1)
        );
    }

    private fetchToursFromFirestore(): Observable<Tour[]> {
        console.log('🔍 Fetching tours from Firestore for user view...');
        return this.fs.collection<Tour>('tours').pipe(
            timeout(this.CONNECTION_TIMEOUT),
            retry({ count: 2, delay: 1000 }),
            map(tours => {
                console.log('📊 All tours from Firestore:', tours.length);
                console.log('📋 Tours data:', tours.map(t => ({ id: t.id, title: t.title, published: t.published })));
                
                // Filter published tours on the client side
                const publishedTours = tours.filter(tour => {
                    // Handle different possible types for published field
                    const publishedValue = tour.published as any;
                    const isPublished = publishedValue === true || publishedValue === 'true' || publishedValue === 1 || publishedValue === '1';
                    console.log(`📖 Tour "${tour.title}" - published: ${publishedValue} (${typeof publishedValue}) -> isPublished: ${isPublished}`);
                    return isPublished;
                }).sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.() || new Date(0);
                    const bTime = b.createdAt?.toDate?.() || new Date(0);
                    return bTime.getTime() - aTime.getTime();
                });
                
                console.log('✅ Published tours for user view:', publishedTours.length);
                return publishedTours;
            }),
            catchError(error => {
                console.error('Firestore connection error:', error);
                
                // If it's a connection/listener error, try to reconnect
                if (error.message?.includes('Database connection error') || 
                    error.message?.includes('Database listener conflict')) {
                    console.log('Attempting to recover from Firestore error...');
                    // Clear any existing listeners and try again
                    this.fs.clearAllListeners();
                    return throwError(() => error);
                }
                
                return of([]);
            })
        );
    }

    private applyClientSideFilters(tours: Tour[], filters?: any): Tour[] {
        if (!filters || !tours.length) return tours;
        return tours.filter(tour => {
            if (filters.type && tour.type !== filters.type) return false;
            if (filters.locations?.length && !tour.location.some(loc => filters.locations.includes(loc))) return false;
            return true;
        });
    }

    async createTour(tour: any): Promise<string> {
        try {
            console.log('Creating tour in Firestore:', tour);
            
            // Validate tour data
            this.validateTourData(tour);
            
            // Ensure proper data structure
            const cleanTour = {
                ...tour,
                // Ensure published field exists and is boolean
                published: tour.published !== undefined ? Boolean(tour.published) : true,
                // Ensure arrays are properly structured
                location: Array.isArray(tour.location) ? tour.location.filter(Boolean) : [tour.location].filter(Boolean),
                features: Array.isArray(tour.features) ? tour.features.filter(Boolean) : [tour.features].filter(Boolean),
                images: Array.isArray(tour.images) ? tour.images.filter(Boolean) : [tour.images].filter(Boolean)
            };
            
            console.log('Clean tour data:', cleanTour);
            
            const tourId = await this.fs.create('tours', cleanTour);
            console.log('Tour created with ID:', tourId);
            
            // Force cache invalidation and refresh
            await this.forceRefreshCache();
            
            return tourId;
        } catch (error: any) {
            console.error('Error creating tour:', error);
            throw new Error('Failed to create tour: ' + (error.message || 'Unknown error'));
        }
    }

    async updateTour(id: string, changes: any): Promise<void> {
        try {
            console.log('Updating tour in Firestore:', id, changes);
            
            // Validate changes
            if (changes.location) {
                changes.location = Array.isArray(changes.location) ? changes.location.filter(Boolean) : [changes.location].filter(Boolean);
            }
            if (changes.features) {
                changes.features = Array.isArray(changes.features) ? changes.features.filter(Boolean) : [changes.features].filter(Boolean);
            }
            if (changes.images) {
                changes.images = Array.isArray(changes.images) ? changes.images.filter(Boolean) : [changes.images].filter(Boolean);
            }
            
            await this.fs.update(`tours/${id}`, changes);
            console.log('Tour updated successfully');
            
            // Force cache refresh
            await this.forceRefreshCache();
            
        } catch (error: any) {
            console.error('Error updating tour:', error);
            throw new Error('Failed to update tour: ' + (error.message || 'Unknown error'));
        }
    }

    async deleteTour(id: string): Promise<void> {
        try {
            console.log('Deleting tour:', id);
            await this.fs.delete(`tours/${id}`);
            console.log('Tour deleted successfully');
            
            // Force cache refresh
            await this.forceRefreshCache();
            
        } catch (error) {
            console.error('Error deleting tour:', error);
            throw error;
        }
    }

    getTourBySlug(slug: string): Observable<Tour | undefined> {
        const cachedTours = this.toursCache$.value;
        if (cachedTours) {
            const cachedTour = cachedTours.find(tour => tour.slug === slug);
            if (cachedTour) return of(cachedTour);
        }

        return this.fs.collection<Tour>('tours', ref =>
            query(ref, where('slug', '==', slug))
        ).pipe(
            map(tours => tours[0]),
            catchError(error => {
                console.error('Error fetching tour by slug:', error);
                return of(undefined);
            })
        );
    }

    private invalidateCache(): void {
        this.cacheTimestamp = 0;
        this.toursCache$.next(null);
    }
    
    private async forceRefreshCache(): Promise<void> {
        this.invalidateCache();
        // Wait a bit for Firestore to sync
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.preloadTours();
    }
    
    // Add method to get all tours for admin purposes (bypassing cache)
    getAllToursAdmin(): Observable<Tour[]> {
        return this.fs.collection<Tour>('tours').pipe(
            timeout(this.CONNECTION_TIMEOUT),
            retry({ count: 2, delay: 1000 }),
            map(tours => {
                return tours.sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.() || new Date(0);
                    const bTime = b.createdAt?.toDate?.() || new Date(0);
                    return bTime.getTime() - aTime.getTime();
                });
            }),
            catchError(error => {
                console.error('Error fetching admin tours:', error);
                return of([]);
            })
        );
    }
    
    // Debug method to check published tours
    debugPublishedTours(): Observable<any> {
        console.log('🔧 Debug: Checking all tours and their published status...');
        return this.fs.collection<Tour>('tours').pipe(
            map(tours => {
                const summary = {
                    total: tours.length,
                    published: tours.filter(t => t.published === true).length,
                    unpublished: tours.filter(t => t.published !== true).length,
                    tours: tours.map(t => ({
                        id: t.id,
                        title: t.title,
                        published: t.published,
                        publishedType: typeof t.published
                    }))
                };
                console.log('🔧 Tours debug summary:', summary);
                return summary;
            })
        );
    }

    // Validate tour data structure
    private validateTourData(tour: any): void {
        const required = ['title', 'type', 'location', 'shortDescription', 'fullDescription', 'durationDays', 'priceDisplay', 'capacity'];
        for (const field of required) {
            if (!tour[field] && tour[field] !== 0) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Validate arrays
        if (!Array.isArray(tour.location) || tour.location.length === 0) {
            throw new Error('At least one location is required');
        }
        
        if (!Array.isArray(tour.images) || tour.images.length === 0) {
            throw new Error('At least one image is required');
        }
    }
}