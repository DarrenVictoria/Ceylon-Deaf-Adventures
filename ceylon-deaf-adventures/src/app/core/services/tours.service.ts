import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { where, orderBy } from "@angular/fire/firestore"
import type { Tour } from "../models/tour.model"
import type { FirestoreService } from "./firestore.service"

@Injectable({
  providedIn: "root",
})
export class ToursService {
  constructor(private firestoreService: FirestoreService) {}

  listTours(filters?: any): Observable<Tour[]> {
    const constraints = [where("published", "==", true), orderBy("createdAt", "desc")]

    if (filters?.type) {
      constraints.push(where("type", "==", filters.type))
    }

    return this.firestoreService.collection<Tour>("tours", constraints)
  }

  getTourBySlug(slug: string): Observable<Tour> {
    return this.firestoreService.doc<Tour>(`tours/${slug}`)
  }

  async createTour(tour: Partial<Tour>): Promise<any> {
    const tourData = {
      ...tour,
      createdAt: new Date(),
      published: false,
    }
    return await this.firestoreService.create("tours", tourData)
  }

  async updateTour(id: string, changes: Partial<Tour>): Promise<void> {
    const updateData = {
      ...changes,
      updatedAt: new Date(),
    }
    await this.firestoreService.update(`tours/${id}`, updateData)
  }

  async deleteTour(id: string): Promise<void> {
    await this.firestoreService.delete(`tours/${id}`)
  }

  async setDateCapacity(tourId: string, dateStr: string, capacity: number): Promise<void> {
    await this.firestoreService.update(`tours/${tourId}/dates/${dateStr}`, {
      capacity,
      booked: 0,
    })
  }
}
