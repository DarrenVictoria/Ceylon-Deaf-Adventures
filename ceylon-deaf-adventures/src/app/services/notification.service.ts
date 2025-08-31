import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; // Assume CDK installed for snackbar

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private snackBar: MatSnackBar) { }

    showToast(message: string, opts?: any): void {
        this.snackBar.open(message, 'OK', { duration: 3000, ...opts });
    }

    ariaAnnounce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
        // Implement with a hidden aria-live element in app.component.html
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            liveRegion.setAttribute('aria-live', politeness);
        }
    }
}