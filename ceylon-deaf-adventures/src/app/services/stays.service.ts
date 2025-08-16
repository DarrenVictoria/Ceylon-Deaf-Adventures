// stays.service.ts
import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { where } from '@firebase/firestore';
import { Stay } from '../models/stay.model';

@Injectable({
    providedIn: 'root'
})
export class StaysService {
    constructor(private firestore: FirestoreService) { }

    listStays(filters?: any): Observable<Stay[]> {
        let queryConditions = [];

        // Only show approved stays by default
        if (!filters?.includeUnapproved) {
            queryConditions.push(where('approved', '==', true));
        }

        // Apply tag filters
        if (filters?.tags) {
            for (const tag of filters.tags) {
                queryConditions.push(where('tags', 'array-contains', tag));
            }
        }

        return this.firestore.collection<Stay>('stays', ...queryConditions);
    }

    async submitStay(stay: Partial<Stay>): Promise<string> {
        return this.firestore.create('stays', {
            ...stay,
            approved: false, // New stays require approval
            createdAt: new Date()
        });
    }

    async approveStay(stayId: string): Promise<void> {
        await this.firestore.update(`stays/${stayId}`, {
            approved: true
        });
    }
}