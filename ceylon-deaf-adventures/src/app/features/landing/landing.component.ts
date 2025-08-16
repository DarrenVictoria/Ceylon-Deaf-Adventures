import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import type { Observable } from "rxjs"
import type { Stay } from "../../core/models/stay.model"
import type { ToursService } from "../../core/services/tours.service"
import type { StaysService } from "../../core/services/stays.service"
import type { ReviewsService } from "../../core/services/reviews.service"
import type { InquiriesService } from "../../core/services/inquiries.service"
import type { NotificationService } from "../../core/services/notification.service"
import { ReactiveFormsModule, type FormBuilder, type FormGroup, Validators } from "@angular/forms"

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen">
      <!-- Skip to content link -->
      <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-teal-600 text-white px-4 py-2 rounded">
        Skip to main content
      </a>

      <!-- Header -->
      <header class="bg-white shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-teal-600">Ceylon Deaf Adventures</h1>
            </div>
            <div class="flex space-x-4">
              <a routerLink="/packages" class="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">Packages</a>
              <a routerLink="/about" class="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md">About</a>
              <a routerLink="/auth/login" class="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">Login</a>
            </div>
          </div>
        </nav>
      </header>

      <main id="main">
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-teal-50 to-orange-50 py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 class="text-5xl font-bold text-gray-900 mb-6">
                  Travel Without Barriers — belong without bounds
                </h2>
                <p class="text-xl text-gray-600 mb-8 italic">
                  Sri Lanka's First Deaf Tour Agency
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <a
                    routerLink="/packages"
                    class="bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 text-center"
                  >
                    Explore Packages
                  </a>
                  <button
                    (click)="openAddStayModal()"
                    class="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-50 focus:ring-4 focus:ring-teal-300"
                  >
                    Add Deaf-Friendly Place
                  </button>
                </div>
              </div>
              <div class="flex justify-center">
                <div class="bg-white rounded-lg shadow-lg p-8 max-w-md">
                  <video
                    class="w-full rounded-lg mb-4"
                    autoplay
                    muted
                    loop
                    [attr.aria-label]="'Hero animation: Ayubowan sign-language greeting (captions available)'"
                  >
                    <source src="/assets/videos/ayubowan-greeting.webm" type="video/webm">
                    <track kind="captions" src="/assets/captions/ayubowan-greeting.vtt" srclang="en" default>
                  </video>
                  <p class="text-center text-gray-600">Welcome greeting in Sri Lankan Sign Language</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Package Selector -->
        <section class="py-16 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 class="text-3xl font-bold text-center mb-12">Choose Your Adventure</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                *ngFor="let package of packageTypes"
                class="bg-white border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-teal-500 hover:shadow-lg transition-all"
                (click)="togglePackagePanel(package.id)"
                [attr.aria-expanded]="expandedPanel === package.id"
                role="button"
                tabindex="0"
                (keydown.enter)="togglePackagePanel(package.id)"
                (keydown.space)="togglePackagePanel(package.id)"
              >
                <div class="text-center">
                  <div class="text-4xl mb-4">{{ package.icon }}</div>
                  <h4 class="text-xl font-semibold mb-2">{{ package.title }}</h4>
                  <p class="text-gray-600">{{ package.description }}</p>
                </div>
              </div>
            </div>

            <!-- Expandable Panel -->
            <div
              *ngIf="expandedPanel"
              class="mt-8 bg-gray-50 rounded-lg p-8 border-l-4 border-teal-500"
              [@slideDown]
            >
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img
                    [src]="getSelectedPackage()?.image"
                    [alt]="getSelectedPackage()?.title"
                    class="w-full h-64 object-cover rounded-lg mb-4"
                  >
                </div>
                <div>
                  <h4 class="text-2xl font-bold mb-4">{{ getSelectedPackage()?.title }}</h4>
                  <p class="text-gray-700 mb-6">{{ getSelectedPackage()?.fullDescription }}</p>
                  <div class="flex items-center gap-6 mb-6">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-teal-600">{{ getSelectedPackage()?.duration }}</div>
                      <div class="text-sm text-gray-600">Duration</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-teal-600">{{ getSelectedPackage()?.price }}</div>
                      <div class="text-sm text-gray-600">Starting from</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-teal-600">{{ getSelectedPackage()?.groupSize }}</div>
                      <div class="text-sm text-gray-600">Group size</div>
                    </div>
                  </div>
                  <div class="flex gap-4">
                    <a
                      routerLink="/packages"
                      class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300"
                    >
                      Read More
                    </a>
                    <button
                      (click)="openBookingForm(getSelectedPackage()?.id)"
                      class="border border-teal-600 text-teal-600 px-6 py-2 rounded-lg hover:bg-teal-50 focus:ring-4 focus:ring-teal-300"
                    >
                      Book / Enquire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Our Stays Slider -->
        <section class="py-16 bg-gray-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-12">
              <h3 class="text-3xl font-bold">Deaf-Friendly Stays</h3>
              <button
                (click)="openAddStayModal()"
                class="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300"
              >
                Add your own Deaf-friendly place now
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                *ngFor="let stay of stays$ | async"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  [src]="stay.images?.[0] || '/placeholder.svg?height=200&width=300'"
                  [alt]="stay.name"
                  class="w-full h-48 object-cover"
                >
                <div class="p-4">
                  <h4 class="text-lg font-semibold mb-2">{{ stay.name }}</h4>
                  <p class="text-gray-600 text-sm mb-3">{{ stay.address }}</p>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span
                      *ngFor="let tag of stay.tags"
                      class="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full"
                    >
                      {{ formatTag(tag) }}
                    </span>
                  </div>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      <span *ngFor="let star of [1,2,3,4,5]">★</span>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ stay.rating || 5 }}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="py-16 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 class="text-3xl font-bold text-center mb-12">What Our Travelers Say</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div
                *ngFor="let review of sampleReviews"
                class="bg-gray-50 rounded-lg p-6"
              >
                <div class="flex items-center mb-4">
                  <div class="flex text-yellow-400 mr-2">
                    <span *ngFor="let star of [1,2,3,4,5]">★</span>
                  </div>
                  <span class="text-sm text-gray-600">{{ review.rating }}/5</span>
                </div>
                <p class="text-gray-700 mb-4">"{{ review.body }}"</p>
                <div class="text-sm text-gray-600">- {{ review.author }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Enquiry Form -->
        <section class="py-16 bg-teal-50">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 class="text-3xl font-bold text-center mb-8">Get in Touch</h3>
            <form [formGroup]="enquiryForm" (ngSubmit)="submitEnquiry()" class="bg-white rounded-lg shadow-lg p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    id="name"
                    formControlName="name"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    formControlName="phone"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                </div>
                <div>
                  <label for="packageId" class="block text-sm font-medium text-gray-700 mb-2">Interested Package</label>
                  <select
                    id="packageId"
                    formControlName="packageId"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select a package</option>
                    <option *ngFor="let pkg of packageTypes" [value]="pkg.id">{{ pkg.title }}</option>
                  </select>
                </div>
              </div>
              <div class="mb-6">
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  id="message"
                  formControlName="message"
                  rows="4"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                ></textarea>
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="preferredContactMethod"
                      value="email"
                      class="mr-2"
                    >
                    Email
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="preferredContactMethod"
                      value="sms"
                      class="mr-2"
                    >
                    SMS
                  </label>
                </div>
              </div>
              <button
                type="submit"
                [disabled]="enquiryForm.invalid || isSubmitting"
                class="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Enquiry' }}
              </button>
            </form>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 class="text-lg font-semibold mb-4">Ceylon Deaf Adventures</h4>
              <p class="text-gray-400">Sri Lanka's First Deaf Tour Agency</p>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
              <ul class="space-y-2">
                <li><a routerLink="/packages" class="text-gray-400 hover:text-white">Packages</a></li>
                <li><a routerLink="/about" class="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Accessibility Statement</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-4">Contact</h4>
              <p class="text-gray-400">info@ceylondeafadventures.com</p>
              <p class="text-gray-400">+94 XX XXX XXXX</p>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-4">Language</h4>
              <select class="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1">
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ceylon Deaf Adventures. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <!-- Add Stay Modal -->
      <div
        *ngIf="showAddStayModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        (click)="closeAddStayModal()"
      >
        <div
          class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <h3 class="text-2xl font-bold mb-6">Add Deaf-Friendly Place</h3>
          <form [formGroup]="addStayForm" (ngSubmit)="submitStay()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  formControlName="name"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  formControlName="contact"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                >
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <textarea
                formControlName="address"
                rows="2"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                required
              ></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                formControlName="website"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
              >
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Accessibility Features</label>
              <div class="grid grid-cols-2 gap-2">
                <label *ngFor="let tag of accessibilityTags" class="flex items-center">
                  <input
                    type="checkbox"
                    [value]="tag.value"
                    (change)="onTagChange($event)"
                    class="mr-2"
                  >
                  {{ tag.label }}
                </label>
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <button
                type="button"
                (click)="closeAddStayModal()"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="addStayForm.invalid || isSubmittingStay"
                class="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                {{ isSubmittingStay ? 'Submitting...' : 'Submit for Review' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LandingComponent implements OnInit {
  stays$: Observable<Stay[]>
  enquiryForm: FormGroup
  addStayForm: FormGroup
  expandedPanel: string | null = null
  showAddStayModal = false
  isSubmitting = false
  isSubmittingStay = false
  selectedTags: string[] = []

  packageTypes = [
    {
      id: "group",
      title: "Join a Group",
      description: "Meet fellow travelers",
      icon: "👥",
      image: "/placeholder.svg?height=300&width=400",
      fullDescription:
        "Join our carefully curated group tours with other Deaf travelers. Experience Sri Lanka together with shared communication and understanding.",
      duration: "3-7 days",
      price: "LKR 25,000+",
      groupSize: "8-12 people",
    },
    {
      id: "private",
      title: "Private Tour",
      description: "Customized experience",
      icon: "🏠",
      image: "/placeholder.svg?height=300&width=400",
      fullDescription:
        "Enjoy a personalized tour designed specifically for you and your companions. Complete flexibility with Deaf-friendly accommodations.",
      duration: "2-14 days",
      price: "LKR 45,000+",
      groupSize: "1-6 people",
    },
    {
      id: "deaf_guide",
      title: "With Deaf Guide",
      description: "Native sign language",
      icon: "🤟",
      image: "/placeholder.svg?height=300&width=400",
      fullDescription:
        "Experience Sri Lanka with certified Deaf guides who understand your culture and communication needs perfectly.",
      duration: "1-10 days",
      price: "LKR 35,000+",
      groupSize: "4-15 people",
    },
    {
      id: "adventure",
      title: "Adventure",
      description: "Thrilling experiences",
      icon: "🏔️",
      image: "/placeholder.svg?height=300&width=400",
      fullDescription:
        "Adventure tours designed with visual safety protocols and Deaf-accessible emergency procedures for peace of mind.",
      duration: "3-5 days",
      price: "LKR 55,000+",
      groupSize: "6-10 people",
    },
  ]

  sampleReviews = [
    {
      rating: 5,
      body: "Amazing experience with the Deaf guide. Finally felt truly understood during travel!",
      author: "Sarah M.",
    },
    {
      rating: 5,
      body: "The visual communication and captions made everything so accessible. Highly recommend!",
      author: "David L.",
    },
    {
      rating: 5,
      body: "Best travel experience ever. The team really understands Deaf culture.",
      author: "Maya P.",
    },
  ]

  accessibilityTags = [
    { value: "deaf_staff", label: "Deaf Staff" },
    { value: "captioned_tv", label: "Captioned TV" },
    { value: "visual_alarm", label: "Visual Alarms" },
    { value: "sign_language", label: "Sign Language Support" },
    { value: "text_communication", label: "Text Communication" },
    { value: "accessible_rooms", label: "Accessible Rooms" },
  ]

  constructor(
    private fb: FormBuilder,
    private toursService: ToursService,
    private staysService: StaysService,
    private reviewsService: ReviewsService,
    private inquiriesService: InquiriesService,
    private notificationService: NotificationService,
  ) {
    this.stays$ = this.staysService.listStays()

    this.enquiryForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      packageId: [""],
      message: ["", Validators.required],
      preferredContactMethod: ["email", Validators.required],
    })

    this.addStayForm = this.fb.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      contact: [""],
      website: [""],
    })
  }

  ngOnInit() {}

  togglePackagePanel(packageId: string) {
    this.expandedPanel = this.expandedPanel === packageId ? null : packageId
  }

  getSelectedPackage() {
    return this.packageTypes.find((pkg) => pkg.id === this.expandedPanel)
  }

  openAddStayModal() {
    this.showAddStayModal = true
    this.selectedTags = []
  }

  closeAddStayModal() {
    this.showAddStayModal = false
    this.addStayForm.reset()
    this.selectedTags = []
  }

  openBookingForm(packageId?: string) {
    if (packageId) {
      this.enquiryForm.patchValue({ packageId })
    }
    // Scroll to enquiry form
    document.querySelector("section:last-of-type")?.scrollIntoView({ behavior: "smooth" })
  }

  onTagChange(event: any) {
    const value = event.target.value
    if (event.target.checked) {
      this.selectedTags.push(value)
    } else {
      this.selectedTags = this.selectedTags.filter((tag) => tag !== value)
    }
  }

  formatTag(tag: string): string {
    return tag.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  async submitEnquiry() {
    if (this.enquiryForm.valid) {
      this.isSubmitting = true
      try {
        await this.inquiriesService.submitInquiry(this.enquiryForm.value)
        this.notificationService.showToast("Enquiry submitted successfully! We will contact you soon.", "success")
        this.enquiryForm.reset()
        this.enquiryForm.patchValue({ preferredContactMethod: "email" })
      } catch (error) {
        this.notificationService.showToast("Error submitting enquiry. Please try again.", "error")
      } finally {
        this.isSubmitting = false
      }
    }
  }

  async submitStay() {
    if (this.addStayForm.valid) {
      this.isSubmittingStay = true
      try {
        const stayData = {
          ...this.addStayForm.value,
          tags: this.selectedTags,
        }
        await this.staysService.submitStay(stayData)
        this.notificationService.showToast("Stay submitted for review! We will verify and publish it soon.", "success")
        this.closeAddStayModal()
      } catch (error) {
        this.notificationService.showToast("Error submitting stay. Please try again.", "error")
      } finally {
        this.isSubmittingStay = false
      }
    }
  }
}
