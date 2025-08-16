import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { orderBy } from "@angular/fire/firestore"
import type { Inquiry } from "../models/inquiry.model"
import type { FirestoreService } from "./firestore.service"

@Injectable({
  providedIn: "root",
})
export class InquiriesService {
  constructor(private firestoreService: FirestoreService) {}

  async submitInquiry(inquiry: Partial<Inquiry>): Promise<any> {
    const inquiryData = {
      ...inquiry,
      status: "new",
      createdAt: new Date(),
    }
    return await this.firestoreService.create("inquiries", inquiryData)
  }

  listInquiries(): Observable<Inquiry[]> {
    return this.firestoreService.collection<Inquiry>("inquiries", [orderBy("createdAt", "desc")])
  }

  async updateInquiryStatus(inquiryId: string, status: Inquiry["status"]): Promise<void> {
    await this.firestoreService.update(`inquiries/${inquiryId}`, { status })
  }
}
