import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, of } from 'rxjs';
import { map, shareReplay, switchMap, catchError, tap, retry } from 'rxjs/operators';
import { where, orderBy, limit, query, QueryConstraint } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { Tour } from '../models/tour';

@Injectable({ providedIn: 'root' })
export class ToursService {
    private toursCache$ = new BehaviorSubject<Tour[] | null>(null);
    private cacheTimestamp = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
    private readonly RETRY_ATTEMPTS = 3;
    private readonly RETRY_DELAY = 1000; // 1 second

    constructor(private fs: FirestoreService) {
        // Preload tours on service initialization
        this.preloadTours();
    }

    private preloadTours(): void {
        // Use a timer to avoid blocking initial load
        timer(100).pipe(
            switchMap(() => this.fetchToursFromFirestore())
        ).subscribe({
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

        if (isCacheValid) {
            // Return cached data immediately
            return this.toursCache$.pipe(
                map(tours => tours || []),
                map(tours => this.applyClientSideFilters(tours, filters))
            );
        }

        // Fetch fresh data
        return this.fetchToursFromFirestore().pipe(
            tap(tours => {
                this.toursCache$.next(tours);
                this.cacheTimestamp = Date.now();
            }),
            map(tours => this.applyClientSideFilters(tours, filters)),
            catchError(error => {
                console.error('Error fetching tours:', error);
                // Fallback to cached data if available
                if (this.toursCache$.value) {
                    return of(this.toursCache$.value);
                }
                return of([]);
            })
        );
    }

    private fetchToursFromFirestore(): Observable<Tour[]> {
        return this.fs.collection<Tour>('tours', ref => {
            const constraints: QueryConstraint[] = [
                where('published', '==', true),
                orderBy('createdAt', 'desc')
            ];
            return query(ref, ...constraints);
        }).pipe(
            retry({
                count: this.RETRY_ATTEMPTS,
                delay: this.RETRY_DELAY
            }),
            shareReplay(1)
        );
    }

    private applyClientSideFilters(tours: Tour[], filters?: any): Tour[] {
        if (!filters) return tours;

        return tours.filter(tour => {
            // Type filter
            if (filters.type && tour.type !== filters.type) {
                return false;
            }

            // Location filter (if needed for client-side filtering)
            if (filters.locations && Array.isArray(filters.locations) && filters.locations.length > 0) {
                const hasMatchingLocation = tour.location.some(location =>
                    filters.locations.includes(location)
                );
                if (!hasMatchingLocation) return false;
            }

            return true;
        });
    }

    getTourBySlug(slug: string): Observable<Tour | undefined> {
        // First check cache for the tour
        const cachedTours = this.toursCache$.value;
        if (cachedTours) {
            const cachedTour = cachedTours.find(tour => tour.slug === slug);
            if (cachedTour) {
                return of(cachedTour);
            }
        }

        // If not in cache, fetch from Firestore
        return this.fs.collection<Tour>('tours', ref =>
            query(ref, where('slug', '==', slug), limit(1))
        ).pipe(
            map(tours => tours[0]),
            retry({
                count: this.RETRY_ATTEMPTS,
                delay: this.RETRY_DELAY
            }),
            catchError(error => {
                console.error('Error fetching tour by slug:', error);
                return of(undefined);
            })
        );
    }

    // Method to get tours by type with caching
    getToursByType(type: string): Observable<Tour[]> {
        return this.listTours({ type });
    }

    // Method to get featured tours (limit to first few for performance)
    getFeaturedTours(limit: number = 6): Observable<Tour[]> {
        return this.listTours().pipe(
            map(tours => tours.slice(0, limit))
        );
    }

    // Method to search tours by text
    searchTours(searchText: string): Observable<Tour[]> {
        const lowerSearchText = searchText.toLowerCase();
        return this.listTours().pipe(
            map(tours => tours.filter(tour =>
                tour.title.toLowerCase().includes(lowerSearchText) ||
                tour.shortDescription.toLowerCase().includes(lowerSearchText) ||
                tour.fullDescription.toLowerCase().includes(lowerSearchText) ||
                tour.location.some(loc => loc.toLowerCase().includes(lowerSearchText))
            ))
        );
    }

    // Admin methods (don't use cache for admin operations)
    createTour(tour: Partial<Tour>): Promise<string> {
        const promise = this.fs.create('tours', tour);

        // Invalidate cache after creation
        promise.then(() => {
            this.invalidateCache();
        });

        return promise;
    }

    updateTour(id: string, changes: Partial<Tour>): Promise<void> {
        const promise = this.fs.update(`tours/${id}`, changes);

        // Invalidate cache after update
        promise.then(() => {
            this.invalidateCache();
        });

        return promise;
    }

    deleteTour(id: string): Promise<void> {
        const promise = this.fs.delete(`tours/${id}`);

        // Invalidate cache after deletion
        promise.then(() => {
            this.invalidateCache();
        });

        return promise;
    }

    // Method to manually refresh cache
    refreshCache(): Observable<Tour[]> {
        this.invalidateCache();
        return this.fetchToursFromFirestore().pipe(
            tap(tours => {
                this.toursCache$.next(tours);
                this.cacheTimestamp = Date.now();
            })
        );
    }

    // Method to get unique locations from cached tours
    getUniqueLocations(): Observable<string[]> {
        return this.listTours().pipe(
            map(tours => [...new Set(tours.flatMap(tour => tour.location))].sort())
        );
    }

    // Method to get available tour types
    getAvailableTypes(): Observable<string[]> {
        return this.listTours().pipe(
            map(tours => [...new Set(tours.map(tour => tour.type))].sort())
        );
    }

    // Private method to invalidate cache
    private invalidateCache(): void {
        this.cacheTimestamp = 0;
        this.toursCache$.next(null);
    }

    // Method to check if cache is valid
    isCacheValid(): boolean {
        const now = Date.now();
        return this.toursCache$.value !== null && (now - this.cacheTimestamp < this.CACHE_DURATION);
    }

    // Method to get cache status for debugging
    getCacheStatus(): { hasData: boolean; isValid: boolean; timestamp: number } {
        return {
            hasData: this.toursCache$.value !== null,
            isValid: this.isCacheValid(),
            timestamp: this.cacheTimestamp
        };
    }
}