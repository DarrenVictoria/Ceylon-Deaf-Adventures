import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';
import { Tour } from '../models/tour';

@Injectable({ providedIn: 'root' })
export class ToursService {
    constructor(private fs: FirestoreService) { }

    listTours(filters?: any): Observable<Tour[]> {
        return this.fs.collection<Tour>('tours', ref => {
            let q = ref.where('published', '==', true);
            if (filters?.type) q = q.where('type', '==', filters.type);
            // Add more filters as needed
            return q;
        });
    }

    getTourBySlug(slug: string): Observable<Tour | undefined> {
        return this.fs.collection<Tour>('tours', ref => ref.where('slug', '==', slug).limit(1)).pipe(
            map(tours => tours[0])
        );
    }

    createTour(tour: Partial<Tour>): Promise<string> {
        return this.fs.create('tours', tour);
    }

    updateTour(id: string, changes: Partial<Tour>): Promise<void> {
        return this.fs.update(`tours/${id}`, changes);
    }

    deleteTour(id: string): Promise<void> {
        return this.fs.delete(`tours/${id}`);
    }
}