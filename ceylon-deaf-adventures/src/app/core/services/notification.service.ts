import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private toastContainer: HTMLElement | null = null

  constructor() {
    this.createToastContainer()
  }

  private createToastContainer(): void {
    this.toastContainer = document.createElement("div")
    this.toastContainer.className = "fixed top-4 right-4 z-50 space-y-2"
    document.body.appendChild(this.toastContainer)
  }

  showToast(message: string, type: "success" | "error" | "info" = "info"): void {
    const toast = document.createElement("div")
    toast.className = `p-4 rounded-lg shadow-lg text-white max-w-sm ${
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
    }`
    toast.textContent = message

    this.toastContainer?.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 5000)
  }

  ariaAnnounce(message: string, politeness: "polite" | "assertive" = "polite"): void {
    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", politeness)
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    announcer.textContent = message

    document.body.appendChild(announcer)

    setTimeout(() => {
      announcer.remove()
    }, 1000)
  }
}
