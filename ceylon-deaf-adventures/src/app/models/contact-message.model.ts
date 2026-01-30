export interface ContactMessage {
    id?: string;
    name: string;
    email: string; // Mandatory
    phone?: string; // Optional
    message: string;
    createdAt: any; // Firestore Timestamp
    read: boolean;
    status: 'new' | 'replied' | 'archived';
}
