// reviews.service.ts
import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { where } from '@firebase/firestore';
import { Review } from '../models/review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewsService {
    constructor(private firestore: FirestoreService) { }

    async submitReview(review: Partial<Review>): Promise<string> {
        return this.firestore.create('reviews', {
            ...review,
            approved: false, // Reviews require approval
            createdAt: new Date()
        });
    }

    listReviews(entityId: string, options?: any): Observable<Review[]> {
        let queryConditions = [
            where('entityId', '==', entityId)
        ];

        // Only show approved reviews by default
        if (!options?.includeUnapproved) {
            queryConditions.push(where('approved', '==', true));
        }

        // Apply sorting
        if (options?.sortBy === 'highest') {
            queryConditions.push(orderBy('rating', 'desc'));
        } else if (options?.sortBy === 'newest') {
            queryConditions.push(orderBy('createdAt', 'desc'));
        }

        return this.firestore.collection<Review>('reviews', ...queryConditions);
    }

    async approveReview(reviewId: string): Promise<void> {
        await this.firestore.update(`reviews/${reviewId}`, {
            approved: true
        });
    }
}