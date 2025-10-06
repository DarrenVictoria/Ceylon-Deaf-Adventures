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
    priceDisplay: number;
    currency: string;
    capacity: number;
    images: string[];
    features: string[];
    accessibility: {
        visualAlarms: boolean;
        staffTrained: boolean;
        ramps: boolean;
        captionsProvided: boolean;
    };
    nextAvailableDates: any[]; // Firestore Timestamp array
    published: boolean;
    createdAt: any; // Firestore Timestamp
    updatedAt?: any; // Firestore Timestamp
}