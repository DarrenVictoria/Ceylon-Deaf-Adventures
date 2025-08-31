export interface Tour {
    id: string;
    title: string;
    slug: string;
    type: 'group' | 'private' | 'deaf_guide' | 'adventure';
    //Is tour or not 
    location: string; //If tour multiple locations array
    shortDescription: string;
    fullDescription: string;
    durationDays: number;
    priceDisplay: number;
    currency: string;
    capacity: number;
    images: string[]; // storage paths or urls
    features: string[]; // tags
    accessibility: { visualAlarms: boolean; staffTrained: boolean; ramps: boolean; captionsProvided: boolean };
    nextAvailableDates: any[]; // Firestore Timestamp array
    published: boolean;
    createdAt: any; // Firestore Timestamp
    updatedAt?: any; // Firestore Timestamp


}