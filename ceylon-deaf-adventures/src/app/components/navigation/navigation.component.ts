import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <nav class="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo (1x1 image) -->
          <a [routerLink]="['/']" class="flex items-center space-x-2">
            <img src="logo.jpeg" alt="Ceylon Deaf Adventures logo" class="w-14 h-14 rounded-lg object-cover aspect-square" />
            <div class="hidden sm:block">
              <span class="font-bold text-lg text-foreground">Ceylon Deaf Adventures</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <a [routerLink]="['/']" class="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a [routerLink]="['/']" class="text-foreground hover:text-primary transition-colors font-medium">
              About Us
            </a>
            <a [routerLink]="['/']" class="text-foreground hover:text-primary transition-colors font-medium">
              Tours
            </a>
           
            <a [routerLink]="['/']" class="text-muted-foreground hover:text-primary transition-colors font-medium">
              Blog
            </a>
            <a [routerLink]="['/']" class="text-muted-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>
          </div>

          <!-- CTA Button -->
          <div class="hidden md:flex items-center space-x-4">
            <a href="#" class="btn btn-accent px-6 py-3">
              Book Your Adventure
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button class="btn btn-ghost btn-sm" (click)="isOpen = !isOpen" aria-label="Toggle menu">
              @if (isOpen) {
                <lucide-icon [name]="'x'" class="h-6 w-6"></lucide-icon>
              } @else {
                <lucide-icon [name]="'menu'" class="h-6 w-6"></lucide-icon>
              }
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        @if (isOpen) {
          <div class="md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2 border border-border">
              <a
                [routerLink]="['/']"
                class="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                (click)="isOpen = false"
              >
                Home
              </a>
              <a
                [routerLink]="['/']"
                class="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                (click)="isOpen = false"
              >
                About Us
              </a>
              <a
                [routerLink]="['/']"
                class="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                (click)="isOpen = false"
              >
                Tours
              </a>
              <div class="pt-4 pb-2">
                <a href="#" class="btn btn-accent w-full" (click)="isOpen = false">
                  Book Your Adventure
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    </nav>
  `
})
export class NavigationComponent {
  isOpen = false;
}
