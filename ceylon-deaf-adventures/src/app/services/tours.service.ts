// tours.service.ts
import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { where } from '@firebase/firestore';
import { Tour } from '../models/tour.model';

@Injectable({
    providedIn: 'root'
})
export class ToursService {
    constructor(private firestore: FirestoreService) { }

    listTours(filters?: any): Observable<Tour[]> {
        let queryConditions = [];

        // Only show published tours by default
        if (!filters?.includeUnpublished) {
            queryConditions.push(where('published', '==', true));
        }

        // Apply other filters
        if (filters?.type) {
            queryConditions.push(where('type', '==', filters.type));
        }

        if (filters?.minPrice) {
            queryConditions.push(where('priceDisplay', '>=', filters.minPrice));
        }

        if (filters?.maxPrice) {
            queryConditions.push(where('priceDisplay', '<=', filters.maxPrice));
        }

        if (filters?.accessibilityFeatures) {
            for (const feature of filters.accessibilityFeatures) {
                queryConditions.push(where(`accessibility.${feature}`, '==', true));
            }
        }

        return this.firestore.collection<Tour>('tours', ...queryConditions);
    }

    getTourBySlug(slug: string): Observable<Tour | undefined> {
        return this.firestore.collection<Tour>('tours',
            where('slug', '==', slug),
            limit(1)
        ).pipe(
            map(tours => tours[0])
        );
    }

    async createTour(tour: Partial<Tour>): Promise<string> {
        return this.firestore.create('tours', {
            ...tour,
            createdAt: new Date(),
            published: false // New tours are unpublished by default
        });
    }

    async updateTour(id: string, changes: Partial<Tour>): Promise<void> {
        await this.firestore.update(`tours/${id}`, {
            ...changes,
            updatedAt: new Date()
        });
    }

    async deleteTour(id: string): Promise<void> {
        await this.firestore.delete(`tours/${id}`);
    }

    async setDateCapacity(tourId: string, dateStr: string, capacity: number): Promise<void> {
        await this.firestore.update(`tours/${tourId}/dates/${dateStr}`, {
            capacity,
            booked: 0 // Initialize booked count
        });
    }
}