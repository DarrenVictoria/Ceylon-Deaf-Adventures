import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import type { Observable } from "rxjs"
import type { Tour } from "../../core/models/tour.model"
import type { ToursService } from "../../core/services/tours.service"

@Component({
  selector: "app-packages",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-4xl font-bold text-center mb-8">Tour Packages</h1>
        
        <!-- Filter Bar -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tour Type</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">All Types</option>
                <option value="group">Join a Group</option>
                <option value="private">Private Tour</option>
                <option value="deaf_guide">With Deaf Guide</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Any Duration</option>
                <option value="1-3">1-3 days</option>
                <option value="4-7">4-7 days</option>
                <option value="8+">8+ days</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Any Price</option>
                <option value="0-30000">Under LKR 30,000</option>
                <option value="30000-60000">LKR 30,000 - 60,000</option>
                <option value="60000+">Above LKR 60,000</option>
              </select>
            </div>
            <div class="flex items-end">
              <button class="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Tours Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            *ngFor="let tour of tours$ | async"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              [src]="tour.images[0] || '/placeholder.svg?height=200&width=300'"
              [alt]="tour.title"
              class="w-full h-48 object-cover"
            >
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                  {{ formatTourType(tour.type) }}
                </span>
                <span class="text-2xl font-bold text-teal-600">
                  {{ tour.currency }} {{ tour.priceDisplay | number }}
                </span>
              </div>
              <h3 class="text-xl font-semibold mb-2">{{ tour.title }}</h3>
              <p class="text-gray-600 mb-3">{{ tour.location }}</p>
              <p class="text-gray-700 mb-4">{{ tour.shortDescription }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{{ tour.durationDays }} days</span>
                <span>Up to {{ tour.capacity }} people</span>
              </div>

              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  *ngFor="let feature of tour.features.slice(0, 3)"
                  class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {{ formatFeature(feature) }}
                </span>
              </div>

              <div class="flex gap-2">
                <a
                  [routerLink]="['/packages', tour.slug]"
                  class="flex-1 bg-teal-600 text-white text-center py-2 rounded-lg hover:bg-teal-700"
                >
                  View Details
                </a>
                <button class="flex-1 border border-teal-600 text-teal-600 py-2 rounded-lg hover:bg-teal-50">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="(tours$ | async)?.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🏝️</div>
          <h3 class="text-2xl font-semibold text-gray-700 mb-2">No tours found</h3>
          <p class="text-gray-600">Try adjusting your filters or check back later for new packages.</p>
        </div>
      </div>
    </div>
  `,
})
export class PackagesComponent implements OnInit {
  tours$: Observable<Tour[]>

  constructor(private toursService: ToursService) {
    this.tours$ = this.toursService.listTours()
  }

  ngOnInit() {}

  formatTourType(type: string): string {
    const types: { [key: string]: string } = {
      group: "Group Tour",
      private: "Private Tour",
      deaf_guide: "Deaf Guide",
      adventure: "Adventure",
    }
    return types[type] || type
  }

  formatFeature(feature: string): string {
    return feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }
}
