import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Product, Reservation } from '../models/product.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { query, where, orderBy } from '@angular/fire/firestore';

import { StorageEnhancedService } from './storage-enhanced.service';

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private firestoreService = inject(FirestoreService);
    private storageEnhancedService = inject(StorageEnhancedService);
    private productsCollection = 'products';
    private reservationsCollection = 'reservations';

    constructor() { }

    // Product Methods
    getProducts(category?: string): Observable<Product[]> {
        if (category && category !== 'All') {
            return this.firestoreService.collection<Product>(this.productsCollection, (ref) =>
                query(ref, where('category', '==', category), orderBy('createdAt', 'desc'))
            ).pipe(
                retry({ count: 3, delay: 2000 }),
                catchError(error => {
                    console.error('Error fetching products:', error);
                    return throwError(() => new Error('Failed to load products. Please check your connection.'));
                })
            );
        }

        return this.firestoreService.collection<Product>(this.productsCollection, (ref) =>
            query(ref, orderBy('createdAt', 'desc'))
        ).pipe(
            retry({ count: 3, delay: 2000 }),
            catchError(error => {
                console.error('Error fetching products:', error);
                return throwError(() => new Error('Failed to load products. Please check your connection.'));
            })
        );
    }

    getProduct(id: string): Observable<Product | undefined> {
        return this.firestoreService.doc<Product>(`${this.productsCollection}/${id}`);
    }

    async addProduct(product: Product): Promise<string> {
        return this.firestoreService.create(this.productsCollection, product);
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<void> {
        return this.firestoreService.update(`${this.productsCollection}/${id}`, product);
    }

    async deleteProduct(id: string): Promise<void> {
        return this.firestoreService.delete(`${this.productsCollection}/${id}`);
    }

    // Reservation Methods
    async createReservation(reservation: Reservation): Promise<string> {
        return this.firestoreService.create(this.reservationsCollection, {
            ...reservation,
            status: 'pending', // Use explicit string 'pending' which matches the literal type
            createdAt: new Date()
        });
    }

    getReservations(): Observable<Reservation[]> {
        return this.firestoreService.collection<Reservation>(this.reservationsCollection, (ref) =>
            query(ref, orderBy('createdAt', 'desc'))
        );
    }

    // Image Upload
    uploadProductImage(file: File): Observable<{ progress: number, downloadURL?: string, error?: string, state?: string }> {
        // Create a unique path for the image
        const path = `products/${file.name}_${Date.now()}`;
        return this.storageEnhancedService.uploadFile(path, file);
    }
}
