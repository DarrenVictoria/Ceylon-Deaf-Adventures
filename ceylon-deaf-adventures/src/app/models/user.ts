export interface User {
    uid: string;
    email?: string; // Optional
    role: 'guest' | 'admin';
    // Add more fields as needed, e.g., displayName: string;
}