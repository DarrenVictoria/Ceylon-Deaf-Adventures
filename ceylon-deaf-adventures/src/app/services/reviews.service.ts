import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Review } from '../models/review';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
    constructor(private fs: FirestoreService) { }

    submitReview(review: Partial<Review>): Promise<string> {
        return this.fs.create('reviews', { ...review, approved: false });
    }

    listReviews(entityId: string, options?: any): Observable<Review[]> {
        return this.fs.collection<Review>('reviews', ref => ref.where('entityId', '==', entityId).where('approved', '==', true));
    }

    approveReview(reviewId: string): Promise<void> {
        return this.fs.update(`reviews/${reviewId}`, { approved: true });
    }
}