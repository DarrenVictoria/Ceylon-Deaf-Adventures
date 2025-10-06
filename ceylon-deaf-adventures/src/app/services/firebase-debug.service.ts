import { Injectable, inject } from '@angular/core';
import { Firestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDebugService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private firestoreService = inject(FirestoreService);

  async testFirestoreConnection(): Promise<void> {
    console.log('=== Firebase Connection Test ===');
    
    try {
      // Test Firestore connection
      console.log('1. Testing Firestore connection...');
      await enableNetwork(this.firestore);
      console.log('✅ Firestore network enabled successfully');
      
      // Test basic write operation
      console.log('2. Testing basic write operation...');
      const testData = {
        test: true,
        timestamp: new Date(),
        message: 'Connection test'
      };
      
      const docId = await this.firestoreService.create('connection-test', testData);
      console.log('✅ Test document created with ID:', docId);
      
      // Test read operation
      console.log('3. Testing read operation...');
      const docs = await this.firestoreService.collection('connection-test').toPromise();
      console.log('✅ Read operation successful. Found documents:', docs?.length || 0);
      
      // Cleanup
      if (docId) {
        await this.firestoreService.delete(`connection-test/${docId}`);
        console.log('✅ Cleanup completed');
      }
      
      console.log('=== All tests passed! Firebase is working correctly ===');
      
    } catch (error: any) {
      console.error('❌ Firebase connection test failed:', {
        error: error.message,
        code: error.code,
        details: error
      });
      
      // Try to diagnose the issue
      this.diagnoseConnectionIssue(error);
    }
  }
  
  private diagnoseConnectionIssue(error: any): void {
    console.log('=== Diagnosing Connection Issue ===');
    
    if (error.code === 'unavailable') {
      console.log('🔍 Issue: Firestore service is unavailable');
      console.log('💡 Solutions:');
      console.log('   - Check your internet connection');
      console.log('   - Verify Firebase project configuration');
      console.log('   - Check Firestore security rules');
    } else if (error.code === 'permission-denied') {
      console.log('🔍 Issue: Permission denied');
      console.log('💡 Solutions:');
      console.log('   - Update Firestore security rules');
      console.log('   - Check if user authentication is required');
    } else if (error.message?.includes('transport')) {
      console.log('🔍 Issue: Transport/Network error');
      console.log('💡 Solutions:');
      console.log('   - Check internet connection');
      console.log('   - Try refreshing the page');
      console.log('   - Check if firewall is blocking connections');
    } else {
      console.log('🔍 Issue: Unknown error');
      console.log('💡 Check the error details above for more information');
    }
  }
  
  logFirebaseConfig(): void {
    console.log('=== Firebase Configuration ===');
    console.log('Firestore app:', this.firestore.app.name);
    console.log('Storage app:', this.storage.app.name);
    console.log('Project ID:', this.firestore.app.options.projectId);
  }
}