// inquiries.service.ts
import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { where } from '@firebase/firestore';
import { Inquiry } from '../models/inquiry.model';

@Injectable({
    providedIn: 'root'
})
export class InquiriesService {
    constructor(private firestore: FirestoreService) { }

    async submitInquiry(inquiry: Partial<Inquiry>): Promise<string> {
        return this.firestore.create('inquiries', {
            ...inquiry,
            status: 'new',
            createdAt: new Date()
        });
    }

    listInquiries(status?: string): Observable<Inquiry[]> {
        let queryConditions = [];

        if (status) {
            queryConditions.push(where('status', '==', status));
        }

        return this.firestore.collection<Inquiry>('inquiries',
            ...queryConditions,
            orderBy('createdAt', 'desc')
        );
    }

    async updateInquiryStatus(inquiryId: string, status: 'new' | 'in_progress' | 'resolved'): Promise<void> {
        await this.firestore.update(`inquiries/${inquiryId}`, {
            status
        });
    }
}