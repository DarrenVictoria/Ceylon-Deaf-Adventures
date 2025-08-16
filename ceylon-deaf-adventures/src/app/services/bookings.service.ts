// bookings.service.ts
import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { where } from '@firebase/firestore';
import { Booking } from '../models/booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingsService {
    constructor(private firestore: FirestoreService) { }

    async requestBooking(booking: Partial<Booking>): Promise<string> {
        return this.firestore.create('bookings', {
            ...booking,
            status: 'pending',
            createdAt: new Date()
        });
    }

    listenBookingStatus(bookingId: string): Observable<Booking> {
        return this.firestore.doc<Booking>(`bookings/${bookingId}`);
    }

    getUserBookings(userId: string): Observable<Booking[]> {
        return this.firestore.collection<Booking>('bookings',
            where('userId', '==', userId)
        );
    }
}