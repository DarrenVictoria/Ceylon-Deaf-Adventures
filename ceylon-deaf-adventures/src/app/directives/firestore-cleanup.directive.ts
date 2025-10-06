import { Directive, OnDestroy, inject } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Directive({
  selector: '[appFirestoreCleanup]',
  standalone: true
})
export class FirestoreCleanupDirective implements OnDestroy {
  private firestoreService = inject(FirestoreService);

  ngOnDestroy() {
    // Clean up any active Firestore listeners when the component is destroyed
    this.firestoreService.clearAllListeners();
  }
}