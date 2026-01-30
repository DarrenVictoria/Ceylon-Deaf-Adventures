// models/tour.ts
export interface Tour {
    id: string;
    title: string;
    slug: string;
    type: 'group' | 'private' | 'deaf_guide' | 'adventure';
    location: string[];
    shortDescription: string;
    fullDescription: string;
    durationDays: number;
    durationNights: number;
    priceDisplay: number;
    currency: string;
    isNegotiable?: boolean;
    capacity: number;
    images: string[];
    features: string[];
    accessibility: {
        visualAlarms: 'available' | 'limited' | 'unavailable';
        staffTrained: 'available' | 'limited' | 'unavailable';
        ramps: 'available' | 'limited' | 'unavailable';
        captionsProvided: 'available' | 'limited' | 'unavailable';
    };
    nextAvailableDates: any[]; // Firestore Timestamp array
    published: boolean;
    createdAt: any; // Firestore Timestamp
    updatedAt?: any; // Firestore Timestamp
}