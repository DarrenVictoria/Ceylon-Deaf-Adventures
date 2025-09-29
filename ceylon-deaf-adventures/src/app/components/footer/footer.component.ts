import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <footer class="footer">
      <div class="container py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <!-- Company Info -->
          <div class="space-y-4">
            <h2 class="text-2xl font-extrabold tracking-wide text-accent">Ceylon Deaf Adventures</h2>
            <p class="text-sm leading-relaxed text-secondary-foreground-80 max-w-xs mx-auto md:mx-0">
              Sri Lanka's first Deaf-friendly tourism company, creating barrier-free adventures for all.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg border-b border-accent inline-block pb-1">Quick Links</h3>
            <nav class="flex flex-col gap-2">
              <a [routerLink]="['/about']" class="footer-link">About Us</a>
              <a [routerLink]="['/tours']" class="footer-link">Tours & Experiences</a>
            </nav>
          </div>

          <!-- Contact Info -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg border-b border-accent inline-block pb-1">Contact Us</h3>
            <div class="flex flex-col gap-3 items-center md:items-start">
              <div class="flex items-center gap-2 text-sm">
                <lucide-icon [name]="'mail'" class="icon text-accent"></lucide-icon>
                <span>info&#64;ceylondeafadventures.com</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <lucide-icon [name]="'map-pin'" class="icon text-accent"></lucide-icon>
                <span>Negombo, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Socials -->
        <div class="flex justify-center md:justify-between items-center mt-12 flex-col md:flex-row gap-6">
          <div class="flex gap-6">
            <a href="https://facebook.com" target="_blank" class="social-icon"><lucide-icon [name]="'facebook'"></lucide-icon></a>
            <a href="https://instagram.com" target="_blank" class="social-icon"><lucide-icon [name]="'instagram'"></lucide-icon></a>
            <a href="https://youtube.com" target="_blank" class="social-icon"><lucide-icon [name]="'youtube'"></lucide-icon></a>
          </div>
          <p class="text-xs text-secondary-foreground-60 text-center">
            © 2025 Ceylon Deaf Adventures. All rights reserved.<br class="md:hidden"/> 
            Travel Without Barriers, Belong Without Bounds.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      --background: 255 255 255;
      --foreground: 17 17 17;
      --muted-foreground: 107 114 128;
      --primary: 45 212 191;
      --accent: 249 115 22;
      --secondary: 30 41 59;
      --secondary-foreground: 255 255 255;
    }
    .footer {
      background: linear-gradient(180deg, rgb(var(--secondary)) 0%, rgb(15, 23, 42) 100%);
      color: rgb(var(--secondary-foreground));
    }
    .container {
      max-width: 80rem;
      margin: 0 auto;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .py-12 {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
    .footer-link {
      font-size: 0.95rem;
      transition: color 0.25s ease-in-out;
      cursor: pointer;
      text-decoration: none;
      color:white;
    }
    .footer-link:hover {
      color: rgb(var(--accent));
    }
    .icon {
      height: 1.1rem;
      width: 1.1rem;
    }
    .social-icon {
      color: rgba(var(--secondary-foreground), 0.8);
      transition: all 0.3s ease;
      font-size: 1.25rem;
    }
    .social-icon:hover {
      color: rgb(var(--accent));
      transform: translateY(-2px);
    }
    .text-secondary-foreground-80 {
      color: rgba(var(--secondary-foreground), 0.8);
    }
    .text-secondary-foreground-60 {
      color: rgba(var(--secondary-foreground), 0.6);
    }
  `]
})
export class FooterComponent { }
