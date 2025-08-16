import type { Timestamp } from "@angular/fire/firestore"

export interface Review {
  id: string
  entityId: string
  entityType: "tour" | "stay"
  userId: string
  rating: number
  title?: string
  body?: string
  videoPath?: string
  captionsPath?: string
  approved: boolean
  createdAt: Timestamp
}
