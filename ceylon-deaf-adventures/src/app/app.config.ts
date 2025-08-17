import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "ceylondeafadventures-25", appId: "1:989123629479:web:a5657f5be21a7d31356682", storageBucket: "ceylondeafadventures-25.firebasestorage.app", apiKey: "AIzaSyDtsJc_O7pBB6PAPyklrMupSD1ZxHL069w", authDomain: "ceylondeafadventures-25.firebaseapp.com", messagingSenderId: "989123629479", measurementId: "G-XJT6KYHTZL" })), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
};
