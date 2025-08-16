import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { where, orderBy } from "@angular/fire/firestore"
import type { Booking } from "../models/booking.model"
import type { FirestoreService } from "./firestore.service"

@Injectable({
  providedIn: "root",
})
export class BookingsService {
  constructor(private firestoreService: FirestoreService) {}

  async requestBooking(booking: Partial<Booking>): Promise<any> {
    const bookingData = {
      ...booking,
      status: "pending",
      createdAt: new Date(),
    }
    return await this.firestoreService.create("bookings", bookingData)
  }

  listenBookingStatus(bookingId: string): Observable<Booking> {
    return this.firestoreService.doc<Booking>(`bookings/${bookingId}`)
  }

  listUserBookings(userId: string): Observable<Booking[]> {
    return this.firestoreService.collection<Booking>("bookings", [
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ])
  }

  listAllBookings(): Observable<Booking[]> {
    return this.firestoreService.collection<Booking>("bookings", [orderBy("createdAt", "desc")])
  }

  async updateBookingStatus(bookingId: string, status: Booking["status"]): Promise<void> {
    await this.firestoreService.update(`bookings/${bookingId}`, { status })
  }
}
