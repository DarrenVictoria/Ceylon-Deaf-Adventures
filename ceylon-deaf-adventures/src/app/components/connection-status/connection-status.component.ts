import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule
  ],
  template: `
    <div class="connection-status-container">
      <mat-chip-set>
        <mat-chip 
          [class]="getStatusClass()"
          matTooltip="Click to reconnect if experiencing issues"
          (click)="forceReconnect()"
        >
          <mat-icon>{{ getStatusIcon() }}</mat-icon>
          <span>{{ getStatusText() }}</span>
        </mat-chip>
      </mat-chip-set>
      
      <button 
        *ngIf="status === 'error' || status === 'disconnected'"
        mat-icon-button 
        color="warn" 
        (click)="forceReconnect()"
        matTooltip="Reconnect to database"
        [disabled]="reconnecting"
      >
        <mat-icon>refresh</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .connection-status-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-connected {
      background-color: #10b981 !important;
      color: white !important;
    }

    .status-disconnected {
      background-color: #6b7280 !important;
      color: white !important;
    }

    .status-error {
      background-color: #ef4444 !important;
      color: white !important;
    }

    .status-reconnecting {
      background-color: #f59e0b !important;
      color: white !important;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    mat-chip {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    mat-chip:hover {
      transform: scale(1.02);
    }

    mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  status: 'connected' | 'disconnected' | 'error' | 'reconnecting' = 'disconnected';
  reconnecting = false;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.firestoreService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.status = status;
        this.reconnecting = status === 'reconnecting';
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStatusClass(): string {
    return `status-${this.status}`;
  }

  getStatusIcon(): string {
    switch (this.status) {
      case 'connected':
        return 'cloud_done';
      case 'disconnected':
        return 'cloud_off';
      case 'error':
        return 'error';
      case 'reconnecting':
        return 'sync';
      default:
        return 'cloud_off';
    }
  }

  getStatusText(): string {
    switch (this.status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      case 'reconnecting':
        return 'Reconnecting...';
      default:
        return 'Unknown';
    }
  }

  async forceReconnect() {
    if (this.reconnecting) return;
    
    try {
      await this.firestoreService.forceReconnect();
    } catch (error) {
      console.error('Manual reconnection failed:', error);
    }
  }
}