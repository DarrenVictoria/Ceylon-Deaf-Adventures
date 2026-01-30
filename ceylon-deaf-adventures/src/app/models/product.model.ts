export interface Product {
    id?: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    inStock: boolean;
    createdAt?: any;
    updatedAt?: any;
}

export interface Reservation {
    id?: string;
    productId: string;
    productName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: any;
}
