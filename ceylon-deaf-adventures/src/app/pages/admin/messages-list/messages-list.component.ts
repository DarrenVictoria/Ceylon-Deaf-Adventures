import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { ContactService } from '../../../services/contact.service';
import { ContactMessage } from '../../../models/contact-message.model';
import { AdminNavigationComponent } from '../../../components/admin-navigation/admin-navigation.component';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    AdminNavigationComponent,
    DatePipe
  ],
  template: `
    <div class="admin-container">
      <app-admin-navigation></app-admin-navigation>

      <div class="admin-header">
        <h1 class="admin-title">
          <mat-icon>mail</mat-icon>
          Messages
        </h1>
        <p class="admin-subtitle">View and manage inquiries from the contact form</p>
      </div>

      <mat-card class="messages-card" *ngIf="messages$ | async as messages; else loading">
        <div class="table-container" *ngIf="messages.length > 0; else emptyState">
          <table mat-table [dataSource]="messages" class="messages-table">
            
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let msg" class="date-cell">
                {{ msg.createdAt.toDate() | date:'mediumDate' }}
                <br>
                <small class="time-text">{{ msg.createdAt.toDate() | date:'shortTime' }}</small>
              </td>
            </ng-container>

            <!-- Sender Column -->
            <ng-container matColumnDef="sender">
              <th mat-header-cell *matHeaderCellDef>Sender</th>
              <td mat-cell *matCellDef="let msg">
                <div class="sender-info">
                  <strong>{{ msg.name }}</strong>
                  <a [href]="'mailto:' + msg.email" class="email-link">{{ msg.email }}</a>
                  <span *ngIf="msg.phone" class="phone-text">{{ msg.phone }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Message Column -->
            <ng-container matColumnDef="message">
              <th mat-header-cell *matHeaderCellDef>Message</th>
              <td mat-cell *matCellDef="let msg" class="message-cell">
                <p class="message-text">{{ msg.message }}</p>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let msg">
                <mat-chip-set>
                    <mat-chip [class]="msg.read ? 'read-chip' : 'unread-chip'" (click)="toggleReadStatus(msg)">
                        {{ msg.read ? 'Read' : 'New' }}
                    </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let msg">
                <a mat-icon-button color="primary" [href]="'mailto:' + msg.email" matTooltip="Reply via Email">
                  <mat-icon>reply</mat-icon>
                </a>
                <button mat-icon-button color="warn" (click)="deleteMessage(msg.id!)" matTooltip="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" [class.unread-row]="!row.read"></tr>
          </table>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <mat-icon class="empty-icon">inbox</mat-icon>
            <h3>No messages yet</h3>
            <p>Inquiries from the contact form will appear here.</p>
          </div>
        </ng-template>
      </mat-card>

      <ng-template #loading>
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading messages...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .admin-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 2.5rem;
      font-weight: 800;
      color: #0b1f3a;
      margin: 0 0 16px 0;
    }
    
    .admin-title mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: #f4b416;
    }

    .admin-subtitle {
      font-size: 1.125rem;
      color: #6b7280;
    }

    .messages-card {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .table-container {
      overflow-x: auto;
    }

    .messages-table {
      width: 100%;
    }

    .date-cell {
      white-space: nowrap;
      min-width: 120px;
      color: #374151;
    }
    
    .time-text {
        color: #9ca3af;
    }

    .sender-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .email-link {
      color: #2563eb;
      text-decoration: none;
      font-size: 0.875rem;
    }
    
    .phone-text {
        font-size: 0.8rem;
        color: #6b7280;
    }

    .message-cell {
      max-width: 400px;
    }

    .message-text {
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: #4b5563;
    }

    .unread-row {
      background-color: #f0f9ff;
    }
    
    .unread-row .message-text {
        font-weight: 500;
        color: #111827;
    }
    
    .unread-chip {
        background-color: #f4b416 !important;
        color: #0b1f3a !important;
        font-weight: 600;
        cursor: pointer;
    }
    
    .read-chip {
        background-color: #e5e7eb !important;
        color: #6b7280 !important;
        cursor: pointer;
    }

    .empty-state {
      padding: 64px;
      text-align: center;
      color: #6b7280;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px;
      gap: 16px;
      color: #6b7280;
    }
  `]
})
export class MessagesListComponent implements OnInit {
  contactService = inject(ContactService);
  messages$ = this.contactService.getMessages();
  displayedColumns: string[] = ['date', 'sender', 'message', 'status', 'actions'];

  ngOnInit() {
    // Logic handled via observable stream
  }

  toggleReadStatus(msg: ContactMessage) {
    if (!msg.read && msg.id) {
      this.contactService.markAsRead(msg.id);
    }
  }

  deleteMessage(id: string) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.contactService.deleteMessage(id);
    }
  }
}
