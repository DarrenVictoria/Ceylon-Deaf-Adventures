import type { Timestamp } from "@angular/fire/firestore"

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  packageId?: string
  message: string
  preferredContactMethod: "email" | "sms"
  status: "new" | "in_progress" | "resolved"
  createdAt: Timestamp
}
