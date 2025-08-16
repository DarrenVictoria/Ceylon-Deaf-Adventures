import type { Routes } from "@angular/router"

export const adminRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./dashboard/dashboard.component").then((m) => m.DashboardComponent),
  },
  {
    path: "tours",
    loadComponent: () => import("./tours/tours.component").then((m) => m.ToursComponent),
  },
  {
    path: "bookings",
    loadComponent: () => import("./bookings/bookings.component").then((m) => m.BookingsComponent),
  },
  {
    path: "stays",
    loadComponent: () => import("./stays/stays.component").then((m) => m.StaysComponent),
  },
  {
    path: "reviews",
    loadComponent: () => import("./reviews/reviews.component").then((m) => m.ReviewsComponent),
  },
  {
    path: "inquiries",
    loadComponent: () => import("./inquiries/inquiries.component").then((m) => m.InquiriesComponent),
  },
]
