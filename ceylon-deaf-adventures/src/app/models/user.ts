export interface User {
    uid: string;
    displayName: string;
    email: string;
    phone?: string;
    role: 'guest' | 'admin';
    isDeaf?: boolean;
    preferredLanguage?: 'en' | 'si' | 'ta';
    createdAt: any; // Firestore Timestamp

    // Users personal preferences as a comment  (eg - can' travel at night)
}