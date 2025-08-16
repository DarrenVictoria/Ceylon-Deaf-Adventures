import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, type Router } from "@angular/router"
import { ReactiveFormsModule, type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { AuthService } from "../../../core/services/auth.service"
import type { NotificationService } from "../../../core/services/notification.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a routerLink="/auth/register" class="font-medium text-teal-600 hover:text-teal-500">
              create a new account
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                formControlName="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              >
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                formControlName="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      try {
        const { email, password } = this.loginForm.value
        await this.authService.signIn(email, password)
        this.notificationService.showToast("Successfully signed in!", "success")
        this.router.navigate(["/"])
      } catch (error: any) {
        this.notificationService.showToast(error.message || "Login failed", "error")
      } finally {
        this.isLoading = false
      }
    }
  }
}
