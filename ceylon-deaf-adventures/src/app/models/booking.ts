export interface Booking {
    id: string;
    userId?: string; // Made optional
    tourId: string;
    tourDate: any; // e.g., Firestore Timestamp for start date
    numPeople: number;
    totalPrice: number; // Allow bidding
    status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
    createdAt: any; // Firestore Timestamp
    paymentRef?: string;
    stayType: 'Homestay' | 'Guesthouse' | 'Villa' | 'Hotel3to5' | 'Camping'; // Added
    specialRequests?: string; // Added
    guideRequired: boolean; // Added
    numDays?: number; // Optional, if overriding tour duration
    guestName?: string; // Added for guest bookings
    guestEmail?: string; // Added for guest bookings
    guestPhone?: string; // Added for guest bookings
}