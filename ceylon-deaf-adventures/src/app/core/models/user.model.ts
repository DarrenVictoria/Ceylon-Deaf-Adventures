import type { Timestamp } from "@angular/fire/firestore"

export interface User {
  uid: string
  displayName: string
  email: string
  phone?: string
  role: "guest" | "admin"
  isDeaf?: boolean
  preferredLanguage?: "en" | "si" | "ta"
  createdAt: Timestamp
}
