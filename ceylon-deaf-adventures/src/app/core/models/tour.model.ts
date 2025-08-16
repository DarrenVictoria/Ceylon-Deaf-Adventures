import type { Timestamp } from "@angular/fire/firestore"

export interface Tour {
  id: string
  title: string
  slug: string
  type: "group" | "private" | "deaf_guide" | "adventure"
  location: string
  shortDescription: string
  fullDescription: string
  durationDays: number
  priceDisplay: number
  currency: string
  capacity: number
  images: string[]
  features: string[]
  accessibility: {
    visualAlarms: boolean
    staffTrained: boolean
    ramps: boolean
    captionsProvided: boolean
  }
  nextAvailableDates: Timestamp[]
  published: boolean
  createdAt: Timestamp
  updatedAt?: Timestamp
}
