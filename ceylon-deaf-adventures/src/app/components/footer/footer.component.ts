import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, Phone, MapPin } from 'lucide-angular';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, MatIconModule],
  template: `
    <footer class="footer">
      <div class="container py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <!-- Company Info -->
          <div class="space-y-4">
            <h2 class="text-2xl font-extrabold tracking-wide text-accent">Ceylon Deaf Adventures</h2>
            <p class="text-sm leading-relaxed text-secondary-foreground-80 max-w-xs mx-auto md:mx-0">
              🌍 Sri Lanka's first deaf-friendly travel agency, creating inclusive and accessible tours designed for the deaf community—while welcoming travelers from all walks of life.
            </p>
            <p class="text-sm leading-relaxed text-secondary-foreground-80 max-w-xs mx-auto md:mx-0">
              ✨ Experience authentic cultural journeys with expert guidance, sign language support, and unforgettable adventures across our beautiful island.
            </p>
           
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg border-b border-accent inline-block pb-1">Quick Links</h3>
            <nav class="flex flex-col gap-2">
              <a [routerLink]="['/about']" class="footer-link">About Us</a>
              <a [routerLink]="['/tours']" class="footer-link">Tours & Experiences</a>
              <a [routerLink]="['/shop']" class="footer-link">Ceylon Craft Shop</a>
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

        <!-- Social Media & Copyright -->
        <div class="mt-12 space-y-8">
          <!-- Social Media Links -->
          <div class="text-center">
            <h4 class="text-lg font-semibold mb-4 text-accent"> Follow us and be part of our inclusive travel community:</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              <a href="https://facebook.com/ceylondeafadventures" target="_blank" rel="noopener noreferrer" class="social-link">
                <div class="social-icon facebook">
                  <mat-icon>facebook</mat-icon>
                </div>
                <span class="social-label">Facebook</span>
              </a>
              <a href="https://instagram.com/ceylondeafadventures" target="_blank" rel="noopener noreferrer" class="social-link">
                <div class="social-icon instagram">
                  <mat-icon>camera_alt</mat-icon>
                </div>
                <span class="social-label">Instagram</span>
              </a>
              <a href="https://youtube.com/@CeylonDeafAdventures" target="_blank" rel="noopener noreferrer" class="social-link">
                <div class="social-icon youtube">
                  <mat-icon>play_circle_filled</mat-icon>
                </div>
                <span class="social-label">YouTube</span>
              </a>
              <a href="https://x.com/CeylonDeafAdv" target="_blank" rel="noopener noreferrer" class="social-link">
                <div class="social-icon twitter">
                  <mat-icon>alternate_email</mat-icon>
                </div>
                <span class="social-label">X (Twitter)</span>
              </a>
              <a href="https://www.linkedin.com/company/ceylon-deaf-adventures" target="_blank" rel="noopener noreferrer" class="social-link">
                <div class="social-icon linkedin">
                  <mat-icon>work</mat-icon>
                </div>
                <span class="social-label">LinkedIn</span>
              </a>
              <a href="https://tiktok.com/@ceylondeafadventures" target="_blank" rel="noopener noreferrer" class="social-link">
                <div class="social-icon tiktok">
                  <mat-icon>music_note</mat-icon>
                </div>
                <span class="social-label">TikTok</span>
              </a>
            </div>
            
          </div>
          
          <!-- Copyright -->
          <div class="text-center border-t border-accent/20 pt-6">
            <p class="text-xs text-secondary-foreground-60">
              © 2025 Ceylon Deaf Adventures. All rights reserved.<br class="md:hidden"/> 
              Travel Without Barriers, Belong Without Bounds.
            </p>
          </div>
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
    
    /* Social Media Styles */
    .social-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
      padding: 16px 8px;
      border-radius: 12px;
    }
    
    .social-link:hover {
      transform: translateY(-2px);
    }
    
    .social-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .social-icon mat-icon {
      font-size: 24px;
      color: white;
    }
    
    .social-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #ffffff;
    }
    
    .facebook {
      background: #1877F2;
    }
    
    .facebook:hover {
      background: #166FE5;
      box-shadow: 0 6px 20px rgba(24, 119, 242, 0.4);
    }
    
    .instagram {
      background: linear-gradient(45deg, #405DE6, #5B51D8, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);
    }
    
    .instagram:hover {
      box-shadow: 0 6px 20px rgba(228, 64, 95, 0.4);
      transform: translateY(-2px) scale(1.05);
    }
    
    .youtube {
      background: #FF0000;
    }
    
    .youtube:hover {
      background: #E60000;
      box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
    }
    
    .twitter {
      background: #000000;
    }
    
    .twitter:hover {
      background: #1a1a1a;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }
    
    .linkedin {
      background: #0A66C2;
    }
    
    .linkedin:hover {
      background: #095A9F;
      box-shadow: 0 6px 20px rgba(10, 102, 194, 0.4);
    }
    
    .tiktok {
      background: linear-gradient(45deg, #FF0050, #00F2EA);
    }
    
    .tiktok:hover {
      box-shadow: 0 6px 20px rgba(255, 0, 80, 0.4);
      transform: translateY(-2px) scale(1.05);
    }
    
    @media (max-width: 640px) {
      .social-icon {
        width: 40px;
        height: 40px;
      }
      
      .social-icon mat-icon {
        font-size: 20px;
      }
      
      .social-label {
        font-size: 0.75rem;
      }
    }
  `]
})
export class FooterComponent { }
