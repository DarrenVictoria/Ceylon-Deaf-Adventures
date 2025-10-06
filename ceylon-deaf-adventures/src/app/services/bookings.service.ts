import { Injectable, inject } from '@angular/core';
import { Observable, of, firstValueFrom } from 'rxjs';
import { map, catchError, switchMap, retry } from 'rxjs/operators';
import { serverTimestamp, query, where, orderBy } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { Booking } from '../models/booking';

@Injectable({ providedIn: 'root' })
export class BookingsService {
    private fs = inject(FirestoreService);
    private auth = inject(AuthService);
    private readonly RETRY_ATTEMPTS = 3;
    private readonly RETRY_DELAY = 1000;

    async requestBooking(booking: Partial<Booking>): Promise<string> {
        try {
            const user = await this.getCurrentUser();

            const bookingData: Partial<Booking> = {
                ...booking,
                userId: user?.uid || undefined,
                status: 'pending' as const,
                // removed createdAt: serverTimestamp(),
                tourId: booking.tourId,
                tourDate: booking.tourDate,
                numPeople: booking.numPeople || 1,
                totalPrice: booking.totalPrice || 0,
                stayType: booking.stayType || 'Homestay',
                guideRequired: booking.guideRequired !== undefined ? booking.guideRequired : true,
                guestName: booking.guestName,
                guestEmail: booking.guestEmail,
                guestPhone: booking.guestPhone || '',
                specialRequests: booking.specialRequests || ''
            };

            this.validateBookingData(bookingData);

            return await this.createBookingWithRetry(bookingData);
        } catch (error) {
            console.error('Booking request failed:', error);
            throw new Error(this.getErrorMessage(error));
        }
    }

    private async getCurrentUser() {
        try {
            // Use firstValueFrom so we await the currentUser$ once (works for both authenticated & guest flows)
            return await firstValueFrom(
                this.auth.currentUser$.pipe(
                    catchError(() => of(null))
                )
            );
        } catch {
            return null;
        }
    }

    private validateBookingData(booking: Partial<Booking>): void {
        const requiredFields = ['tourId', 'tourDate', 'numPeople', 'totalPrice', 'guestName', 'guestEmail'];
        const missingFields = requiredFields.filter(field => !booking[field as keyof Booking]);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (booking.guestEmail && !this.isValidEmail(booking.guestEmail)) {
            throw new Error('Invalid email address format');
        }

        if (booking.numPeople && (booking.numPeople < 1 || booking.numPeople > 20)) {
            throw new Error('Number of people must be between 1 and 20');
        }

        if (booking.totalPrice && booking.totalPrice < 0) {
            throw new Error('Price cannot be negative');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private async createBookingWithRetry(booking: Partial<Booking>): Promise<string> {
        let lastError: any;

        for (let attempt = 1; attempt <= this.RETRY_ATTEMPTS; attempt++) {
            try {
                return await this.fs.create('bookings', booking);
            } catch (error) {
                lastError = error;
                console.warn(`Booking attempt ${attempt} failed:`, error);

                if (attempt < this.RETRY_ATTEMPTS) {
                    await this.delay(this.RETRY_DELAY * attempt);
                }
            }
        }

        throw lastError;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getErrorMessage(error: any): string {
        if (typeof error === 'string') return error;
        if (error?.message) return error.message;
        if (error?.code) {
            switch (error.code) {
                case 'permission-denied':
                    return 'You do not have permission to make bookings. Please try again later.';
                case 'unavailable':
                    return 'Service is temporarily unavailable. Please try again later.';
                case 'deadline-exceeded':
                    return 'Request timed out. Please check your connection and try again.';
                default:
                    return `Booking failed (${error.code}). Please try again.`;
            }
        }
        return 'An unexpected error occurred. Please try again.';
    }

    // === QUERIES (use ref => query(ref, ...)) ===

    listUserBookings(): Observable<Booking[]> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) return of([]);

                return this.fs.collection<Booking>('bookings', ref =>
                    query(
                        ref,
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    )
                ).pipe(
                    retry({ count: this.RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
                    catchError(error => {
                        console.error('Error fetching user bookings:', error);
                        return of([]);
                    })
                );
            })
        );
    }

    listAllBookings(): Observable<Booking[]> {
        return this.fs.collection<Booking>('bookings', ref =>
            query(
                ref,
                orderBy('createdAt', 'desc')
            )
        ).pipe(
            retry({ count: this.RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
            catchError(error => {
                console.error('Error fetching all bookings:', error);
                return of([]);
            })
        );
    }

    getBookingsByStatus(status: string): Observable<Booking[]> {
        return this.fs.collection<Booking>('bookings', ref =>
            query(
                ref,
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            )
        ).pipe(
            retry({ count: this.RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
            catchError(error => {
                console.error('Error fetching bookings by status:', error);
                return of([]);
            })
        );
    }

    async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'): Promise<void> {
        try {
            await this.fs.update(`bookings/${bookingId}`, {
                status,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating booking status:', error);
            throw new Error('Failed to update booking status. Please try again.');
        }
    }

    async cancelBooking(bookingId: string): Promise<void> {
        return this.updateBookingStatus(bookingId, 'cancelled');
    }

    getBooking(bookingId: string): Observable<Booking | undefined> {
        return this.fs.doc<Booking>(`bookings/${bookingId}`).pipe(
            retry({ count: this.RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
            catchError(error => {
                console.error('Error fetching booking:', error);
                return of(undefined);
            })
        );
    }

    getBookingsForTour(tourId: string): Observable<Booking[]> {
        return this.fs.collection<Booking>('bookings', ref =>
            query(
                ref,
                where('tourId', '==', tourId),
                orderBy('createdAt', 'desc')
            )
        ).pipe(
            retry({ count: this.RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
            catchError(error => {
                console.error('Error fetching tour bookings:', error);
                return of([]);
            })
        );
    }

    checkAvailability(tourId: string, date: Date): Observable<boolean> {
        const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

        return this.fs.collection<Booking>('bookings', ref =>
            query(
                ref,
                where('tourId', '==', tourId),
                where('tourDate', '>=', dateStart),
                where('tourDate', '<', dateEnd),
                where('status', 'in', ['pending', 'confirmed'])
            )
        ).pipe(
            map(bookings => {
                const totalBookings = bookings.reduce((sum, booking) => sum + (booking.numPeople || 0), 0);
                return totalBookings < 20;
            }),
            catchError(() => of(true))
        );
    }
}
