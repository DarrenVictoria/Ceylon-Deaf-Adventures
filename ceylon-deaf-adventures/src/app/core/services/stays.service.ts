import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { where, orderBy } from "@angular/fire/firestore"
import type { Stay } from "../models/stay.model"
import type { FirestoreService } from "./firestore.service"

@Injectable({
  providedIn: "root",
})
export class StaysService {
  constructor(private firestoreService: FirestoreService) {}

  listStays(filters?: any): Observable<Stay[]> {
    const constraints = [where("approved", "==", true), orderBy("createdAt", "desc")]
    return this.firestoreService.collection<Stay>("stays", constraints)
  }

  listPendingStays(): Observable<Stay[]> {
    return this.firestoreService.collection<Stay>("stays", [
      where("approved", "==", false),
      orderBy("createdAt", "desc"),
    ])
  }

  async submitStay(stay: Partial<Stay>): Promise<any> {
    const stayData = {
      ...stay,
      approved: false,
      createdAt: new Date(),
    }
    return await this.firestoreService.create("stays", stayData)
  }

  async approveStay(stayId: string): Promise<void> {
    await this.firestoreService.update(`stays/${stayId}`, { approved: true })
  }

  async rejectStay(stayId: string): Promise<void> {
    await this.firestoreService.delete(`stays/${stayId}`)
  }
}
