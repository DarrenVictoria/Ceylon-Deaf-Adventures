import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCleanupService implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  constructor(private firestoreService: FirestoreService) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up all listeners when the service is destroyed
    this.firestoreService.clearAllListeners();
  }

  // Method to get the destroy subject for components to use
  getDestroySubject(): Subject<void> {
    return this.destroy$;
  }

  // Method to manually trigger cleanup
  cleanupListeners(): void {
    this.firestoreService.clearAllListeners();
  }

  // Method to check if Firestore is ready
  isFirestoreReady(): boolean {
    return this.firestoreService.isReady();
  }

  // Method to wait for Firestore to be ready
  async waitForFirestore(): Promise<void> {
    return this.firestoreService.waitForConnection();
  }
}