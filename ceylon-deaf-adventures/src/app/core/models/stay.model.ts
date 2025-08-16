import type { Timestamp, GeoPoint } from "@angular/fire/firestore"

export interface Stay {
  id: string
  name: string
  address: string
  coords?: GeoPoint
  contact?: string
  website?: string
  images?: string[]
  tags: string[]
  rating?: number
  submittedBy?: string
  approved: boolean
  createdAt: Timestamp
}
