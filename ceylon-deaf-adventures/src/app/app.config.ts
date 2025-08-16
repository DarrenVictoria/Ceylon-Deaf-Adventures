import type { ApplicationConfig } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { provideAuth, getAuth } from "@angular/fire/auth"
import { provideFirestore, getFirestore } from "@angular/fire/firestore"
import { provideStorage, getStorage } from "@angular/fire/storage"
import { routes } from "./app.routes"

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
}
