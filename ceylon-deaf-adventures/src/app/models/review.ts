export interface Review {
    id: string;
    entityId: string;
    entityType: 'tour';
    userId: string;
    rating: number;
    title?: string;
    body?: string;
    videoPath?: string;
    captionsPath?: string; // vtt
    approved: boolean;
    createdAt: any; // Firestore Timestamp
}