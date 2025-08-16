import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { where, orderBy } from "@angular/fire/firestore"
import type { Review } from "../models/review.model"
import type { FirestoreService } from "./firestore.service"

@Injectable({
  providedIn: "root",
})
export class ReviewsService {
  constructor(private firestoreService: FirestoreService) {}

  async submitReview(review: Partial<Review>): Promise<any> {
    const reviewData = {
      ...review,
      approved: false,
      createdAt: new Date(),
    }
    return await this.firestoreService.create("reviews", reviewData)
  }

  listReviews(entityId: string, options?: any): Observable<Review[]> {
    const constraints = [where("entityId", "==", entityId), where("approved", "==", true), orderBy("createdAt", "desc")]
    return this.firestoreService.collection<Review>("reviews", constraints)
  }

  listPendingReviews(): Observable<Review[]> {
    return this.firestoreService.collection<Review>("reviews", [
      where("approved", "==", false),
      orderBy("createdAt", "desc"),
    ])
  }

  async approveReview(reviewId: string): Promise<void> {
    await this.firestoreService.update(`reviews/${reviewId}`, { approved: true })
  }

  async rejectReview(reviewId: string): Promise<void> {
    await this.firestoreService.delete(`reviews/${reviewId}`)
  }
}
