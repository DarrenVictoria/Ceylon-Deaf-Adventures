import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-accessibility-panel",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50">
      <button
        (click)="togglePanel()"
        class="bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300"
        aria-label="Toggle accessibility panel"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
        </svg>
      </button>

      <div
        *ngIf="isOpen"
        class="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64"
      >
        <h3 class="text-lg font-semibold mb-4">Accessibility Settings</h3>
        
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="settings.captionsDefault"
              (change)="saveSettings()"
              class="mr-2"
            >
            Captions on by default
          </label>

          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="settings.highContrast"
              (change)="saveSettings(); applyHighContrast()"
              class="mr-2"
            >
            High contrast mode
          </label>

          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="settings.reducedMotion"
              (change)="saveSettings(); applyReducedMotion()"
              class="mr-2"
            >
            Reduce motion
          </label>

          <div>
            <label class="block text-sm font-medium mb-1">Font Size</label>
            <select
              [(ngModel)]="settings.fontSize"
              (change)="saveSettings(); applyFontSize()"
              class="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AccessibilityPanelComponent implements OnInit {
  isOpen = false
  settings = {
    captionsDefault: true,
    highContrast: false,
    reducedMotion: false,
    fontSize: "normal",
  }

  ngOnInit() {
    this.loadSettings()
    this.applySettings()
  }

  togglePanel() {
    this.isOpen = !this.isOpen
  }

  loadSettings() {
    const saved = localStorage.getItem("accessibility-settings")
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) }
    }
  }

  saveSettings() {
    localStorage.setItem("accessibility-settings", JSON.stringify(this.settings))
  }

  applySettings() {
    this.applyHighContrast()
    this.applyReducedMotion()
    this.applyFontSize()
  }

  applyHighContrast() {
    document.body.classList.toggle("high-contrast", this.settings.highContrast)
  }

  applyReducedMotion() {
    document.body.classList.toggle("reduce-motion", this.settings.reducedMotion)
  }

  applyFontSize() {
    document.body.classList.remove("font-large", "font-extra-large")
    if (this.settings.fontSize === "large") {
      document.body.classList.add("font-large")
    } else if (this.settings.fontSize === "extra-large") {
      document.body.classList.add("font-extra-large")
    }
  }
}
