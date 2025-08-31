import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Booking } from '../models/booking';

@Injectable({ providedIn: 'root' })
export class BookingsService {
    constructor(private fs: FirestoreService) { }

    requestBooking(booking: Partial<Booking>): Promise<string> {
        return this.fs.create('bookings', { ...booking, status: 'pending' });
    }

    listBookings(): Observable<Booking[]> {
        return this.fs.collection<Booking>('bookings');
    }

    updateBookingStatus(bookingId: string, status: string): Promise<void> {
        return this.fs.update(`bookings/${bookingId}`, { status });
    }
}