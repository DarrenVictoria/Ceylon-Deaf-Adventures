export interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    preferredContactMethod: 'email' | 'sms' | 'whatsapp' | 'wechat' | 'telegram';
    status: 'new' | 'in_progress' | 'resolved';
    createdAt: any; // Firestore Timestamp
}