import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';
import { ShopService } from '../../../services/shop.service';
import { Reservation } from '../../../models/product.model';
import { Observable, catchError, of } from 'rxjs';

@Component({
    selector: 'app-product-reservations-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatProgressBarModule,
        AdminNavigationComponent
    ],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <app-admin-navigation title="Product Reservations" />

      <div class="container mx-auto p-6 max-w-7xl flex-grow">
        
        <div class="flex items-center gap-4 mb-6">
            <h1 class="text-2xl font-bold text-navy-900 m-0">
                Product Reservations
            </h1>
        </div>

        <mat-card class="reservations-card">
            <mat-card-content class="p-0">
                <div class="table-container">
                    <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>
                    
                    <table mat-table [dataSource]="reservations$" class="w-full">
                        
                        <!-- Date Column -->
                        <ng-container matColumnDef="date">
                            <th mat-header-cell *matHeaderCellDef> Date </th>
                            <td mat-cell *matCellDef="let reservation"> 
                                {{ reservation.createdAt?.toDate() | date:'mediumDate' }} 
                            </td>
                        </ng-container>

                        <!-- Product Column -->
                        <ng-container matColumnDef="product">
                            <th mat-header-cell *matHeaderCellDef> Product </th>
                            <td mat-cell *matCellDef="let reservation"> 
                                <span class="font-semibold">{{ reservation.productName }}</span>
                            </td>
                        </ng-container>

                        <!-- Customer Column -->
                        <ng-container matColumnDef="customer">
                            <th mat-header-cell *matHeaderCellDef> Customer </th>
                            <td mat-cell *matCellDef="let reservation">
                                <div class="flex flex-col py-2">
                                    <span class="font-medium">{{ reservation.customerName }}</span>
                                    <span class="text-xs text-gray-500">{{ reservation.customerEmail }}</span>
                                    <span class="text-xs text-gray-500">{{ reservation.customerPhone }}</span>
                                </div>
                            </td>
                        </ng-container>

                        <!-- Message Column -->
                        <ng-container matColumnDef="message">
                            <th mat-header-cell *matHeaderCellDef> Message </th>
                            <td mat-cell *matCellDef="let reservation" class="max-w-xs truncate-cell">
                                <span class="text-sm text-gray-600" [title]="reservation.message">{{ reservation.message || '-' }}</span>
                            </td>
                        </ng-container>

                        <!-- Status Column -->
                        <ng-container matColumnDef="status">
                            <th mat-header-cell *matHeaderCellDef> Status </th>
                            <td mat-cell *matCellDef="let reservation">
                                <mat-chip-set>
                                    <mat-chip [class]="getStatusClass(reservation.status)">
                                        {{ reservation.status | titlecase }}
                                    </mat-chip>
                                </mat-chip-set>
                            </td>
                        </ng-container>

                        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

                        <!-- Empty State -->
                        <tr class="mat-row" *matNoDataRow>
                            <td class="mat-cell p-8 text-center text-gray-500" [attr.colspan]="displayedColumns.length">
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <mat-icon class="text-4xl text-gray-300 h-10 w-10">inbox</mat-icon>
                                    <p>No reservations found.</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .text-navy-900 { color: #0b1f3a; }
    
    .reservations-card {
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        overflow: hidden;
    }

    .table-container {
        overflow-x: auto;
    }

    /* Status Chip Styling */
    ::ng-deep .mat-mdc-chip {
        --mdc-chip-label-text-color: white;
        font-weight: 500;
        font-size: 0.75rem;
    }

    .status-pending { --mdc-chip-elevated-container-color: #f59e0b; /* Amber 500 */ }
    .status-confirmed { --mdc-chip-elevated-container-color: #10b981; /* Emerald 500 */ }
    .status-cancelled { --mdc-chip-elevated-container-color: #ef4444; /* Red 500 */ }

    .truncate-cell {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
  `]
})
export class ProductReservationsListComponent implements OnInit {
    private shopService = inject(ShopService);

    reservations$: Observable<Reservation[]> = of([]);
    isLoading = true;
    displayedColumns: string[] = ['date', 'product', 'customer', 'message', 'status'];

    ngOnInit() {
        this.reservations$ = this.shopService.getReservations().pipe(
            catchError(err => {
                console.error('Error loading reservations:', err);
                return of([]);
            })
        );

        // Simple improved loading handling
        this.reservations$.subscribe(() => this.isLoading = false);
    }

    getStatusClass(status: string): string {
        return `status-${status.toLowerCase()}`;
    }
}
