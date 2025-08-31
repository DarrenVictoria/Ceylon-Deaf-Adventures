import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <footer class="bg-secondary text-secondary-foreground">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
             
              <span class="font-bold text-lg">Ceylon Deaf Adventures</span>
            </div>
            <p class="text-sm text-secondary-foreground/80">
              Sri Lanka's first Deaf-friendly tourism company, creating barrier-free adventures for all.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Quick Links</h3>
            <div class="space-y-2">
              <a [routerLink]="['/about']" class="block text-sm hover:text-accent transition-colors">
                About Us
              </a>
              <a [routerLink]="['/tours']" class="block text-sm hover:text-accent transition-colors">
                Tours & Experiences
              </a>
            
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Contact Us</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-2 text-sm">
                <lucide-icon [name]="'mail'" class="h-4 w-4 text-accent"></lucide-icon>
                <span>info&#64;ceylondeafadventures.com</span>
              </div>
              <!--<div class="flex items-center space-x-2 text-sm">
                <lucide-icon [name]="'phone'" class="h-4 w-4 text-accent"></lucide-icon>
                <span>WhatsApp/Video Call Available</span>
              </div>-->
              <div class="flex items-center space-x-2 text-sm">
                <lucide-icon [name]="'map-pin'" class="h-4 w-4 text-accent"></lucide-icon>
                <span>Negombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <!--
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Follow Us</h3>
            <div class="flex space-x-4">
              
              <a href="#" class="text-secondary-foreground hover:text-accent transition-colors">
                <lucide-icon [name]="'facebook'" class="h-6 w-6"></lucide-icon>
                <span class="sr-only">Facebook</span>
              </a>

              <a href="#" class="text-secondary-foreground hover:text-accent transition-colors">
                <lucide-icon [name]="'instagram'" class="h-6 w-6"></lucide-icon>
                <span class="sr-only">Instagram</span>
              </a>

              <a href="#" class="text-secondary-foreground hover:text-accent transition-colors">
                <lucide-icon [name]="'youtube'" class="h-6 w-6"></lucide-icon>
                <span class="sr-only">YouTube</span>
              </a>

            </div>
          </div>
          -->


        </div>
        <div class="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p class="text-sm text-secondary-foreground/60">
            © 2024 Ceylon Deaf Adventures. All rights reserved. | Travel Without Barriers, Belong Without Bounds.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }