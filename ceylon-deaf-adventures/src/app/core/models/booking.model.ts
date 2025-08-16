import type { Timestamp } from "@angular/fire/firestore"

export interface Booking {
  id: string
  userId: string
  tourId: string
  tourDate: Timestamp
  numPeople: number
  totalPrice: number
  status: "pending" | "confirmed" | "rejected" | "cancelled"
  createdAt: Timestamp
  paymentRef?: string
}
