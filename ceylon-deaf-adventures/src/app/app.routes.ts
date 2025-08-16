import type { Routes } from "@angular/router"
import { AdminGuard } from "./core/guards/admin.guard"

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/landing/landing.component").then((m) => m.LandingComponent),
  },
  {
    path: "packages",
    loadComponent: () => import("./features/packages/packages.component").then((m) => m.PackagesComponent),
  },
  {
    path: "packages/:slug",
    loadComponent: () =>
      import("./features/packages/package-detail/package-detail.component").then((m) => m.PackageDetailComponent),
  },
  {
    path: "about",
    loadComponent: () => import("./features/about/about.component").then((m) => m.AboutComponent),
  },
  {
    path: "auth",
    loadChildren: () => import("./features/auth/auth.routes").then((m) => m.authRoutes),
  },
  {
    path: "admin",
    loadChildren: () => import("./features/admin/admin.routes").then((m) => m.adminRoutes),
    canActivate: [AdminGuard],
  },
  {
    path: "**",
    redirectTo: "",
  },
]
