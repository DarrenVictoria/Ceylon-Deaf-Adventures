export interface Booking {
    id: string;
    userId: string;
    tourId: string;
    tourDate: any; // Entered and ask how many days willing to stay
    numPeople: number;
    totalPrice: number; // allow them to bid 
    status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
    createdAt: any; // Firestore Timestamp
    paymentRef?: string;

    //Type of stay : [Homestay , Guesthouse, Villa, Hotel 3to5, Camping ]
    // Any special requests or notes from the user
    // Guide required: boolean; // If they want a deaf guide or not

}