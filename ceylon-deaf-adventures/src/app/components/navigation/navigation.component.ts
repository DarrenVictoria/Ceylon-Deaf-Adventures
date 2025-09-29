import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <nav class="nav">
      <div class="container">
        <div class="flex-between items-center h-16">
          <!-- Logo (1x1 image) -->
          <a [routerLink]="['/']" class="flex items-center space-x-2 links">
            <img style="max-width:70px" src="logo.png" alt="Ceylon Deaf Adventures logo" class="logo-img" />
            <div class="hidden-sm-block">
              <span class="font-bold text-lg text-foreground">Ceylon Deaf Adventures</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden-md-flex items-center space-x-8">
            <a [routerLink]="['/']" class="text-foreground hover-text-primary font-medium links">
              Home
            </a>
            <a [routerLink]="['/about']" class="text-foreground hover-text-primary font-medium links">
              About Us
            </a>
            <a [routerLink]="['/tours']" class="text-foreground hover-text-primary font-medium links">
              Tours
            </a>
           
            <a [routerLink]="['/']" class="text-muted-foreground hover-text-primary font-medium links">
              Blog
            </a>
            <a [routerLink]="['/']" class="text-muted-foreground hover-text-primary font-medium links">
              Contact
            </a>
          </div>

          <!-- CTA Button -->
          <div class="hidden-md-flex items-center space-x-4">
            <a href="#" class="btn btn-accent">
              Book Your Adventure
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="md-hidden">
            <button class="btn-ghost btn-sm" (click)="isOpen = !isOpen" aria-label="Toggle menu">
              @if (isOpen) {
                <lucide-icon [name]="'x'" class="icon"></lucide-icon>
              } @else {
                <lucide-icon [name]="'menu'" class="icon"></lucide-icon>
              }
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        @if (isOpen) {
          <div class="md-hidden">
            <div class="mobile-menu">
              <a
                [routerLink]="['/']"
                class="mobile-link"
                (click)="isOpen = false"
              >
                Home
              </a>
              <a
                [routerLink]="['/about']"
                class="mobile-link"
                (click)="isOpen = false"
              >
                About Us
              </a>
              <a
                [routerLink]="['/tours']"
                class="mobile-link"
                (click)="isOpen = false"
              >
                Tours
              </a>
              <div class="pt-4 pb-3">
                <a href="#" class="btn btn-accent w-full" (click)="isOpen = false">
                  Book Your Adventure
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    :host {
      --background: 255 255 255;
      --foreground: 17 17 17;
      --muted-foreground: 107 114 128;
      --primary: 45 212 191;
      --accent: 249 115 22;
      --secondary: 100 116 139;
      --border: 229 231 235;
      --card: 255 255 255;
      --muted: 249 250 251;
    }
    .nav {
      position: sticky;
      top: 0;
      z-index: 50;
      background-color: #ffffff;
      backdrop-filter: blur(8px);
      border-bottom: 1px solid ;
    }

    .links{
    text-decoration: none;
    }
    .container {
      max-width: 80rem;
      margin: 0 auto;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    @media (min-width: 640px) {
      .container {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }
    @media (min-width: 1024px) {
      .container {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }
    .flex-between {
      display: flex;
      justify-content: space-between;
    }
    .items-center {
      align-items: center;
    }
    .h-16 {
      height: 4rem;
    }
    .flex {
      display: flex;
    }
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    .space-x-4 > * + * {
      margin-left: 1rem;
    }
    .space-x-8 > * + * {
      margin-left: 2rem;
    }
    .logo-img {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 0.5rem;
      object-fit: cover;
      aspect-ratio: 1/1;
    }
    .hidden-sm-block {
      display: none;
    }
    @media (min-width: 640px) {
      .hidden-sm-block {
        display: block;
      }
    }
    .font-bold {
      font-weight: 700;
    }
    .text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    .text-foreground {
      color: rgb(var(--foreground));
    }
    .hidden-md-flex {
      display: none;
    }
    @media (min-width: 768px) {
      .hidden-md-flex {
        display: flex;
      }
    }
    .hover-text-primary:hover {
      color: rgb(var(--accent));
    }
    .font-medium {
      font-weight: 500;
    }
    .text-muted-foreground {
      color: rgb(var(--muted-foreground));
    }
    .btn {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      border-radius: 0.375rem;
      text-decoration: none;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    }
    .btn-accent {
      background-color: rgb(var(--accent));
      color: #fff;
    }
    .md-hidden {
      display: block;
    }
    @media (min-width: 768px) {
      .md-hidden {
        display: none;
      }
    }
    .btn-ghost {
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
    }
    .icon {
      height: 1.5rem;
      width: 1.5rem;
    }
    .mobile-menu {
      padding: 0.5rem;
      padding-top: 0.5rem;
      padding-bottom: 0.75rem;
      background-color: rgb(var(--card));
      border-radius: 0.5rem;
      margin-top: 0.5rem;
      border: 1px solid rgb(var(--border));
    }
    .mobile-link {
      display: block;
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      color: rgb(var(--foreground));
      border-radius: 0.375rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    }
    .mobile-link:hover {
      color: rgb(var(--primary));
      background-color: rgb(var(--muted));
    }
    .pt-4 {
      padding-top: 1rem;
    }
    .pb-3 {
      padding-bottom: 0.75rem;
    }
    .w-full {
      width: 100%;
    }
  `]
})
export class NavigationComponent {
  isOpen = false;
}