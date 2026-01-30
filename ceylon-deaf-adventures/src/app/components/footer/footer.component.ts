import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <footer class="footer">
      <div class="container py-8">
        <div class="footer-content">
          
          <!-- Left: Brand & Info -->
          <div class="brand-section">
            <h2 class="text-2xl font-extrabold tracking-wide text-white mb-2">
              Ceylon Deaf <span class="text-accent">Adventures</span>
            </h2>
            <p class="text-sm text-gray-400 max-w-md mb-4 leading-relaxed">
              Sri Lanka's first deaf-friendly travel agency. Authentic, accessible, and unforgettable journeys for everyone.
            </p>
            <div class="contact-mini">
              <div class="flex items-center gap-2 text-sm text-gray-300">
                <mat-icon class="icon-xs">email</mat-icon>
                <span>info&#64;ceylondeafadventures.com</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-300 mt-1">
                <mat-icon class="icon-xs">phone</mat-icon>
                <span>+94 765535051</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-6">
              © {{ currentYear }} Ceylon Deaf Adventures. All rights reserved.
            </p>
          </div>

          <!-- Right: Links & Socials -->
          <div class="links-section">
            
            <!-- Concise Links Row -->
            <nav class="footer-nav">
              <a [routerLink]="['/']" class="footer-link">Home</a>
              <a [routerLink]="['/about']" class="footer-link">About</a>
              <a [routerLink]="['/tours']" class="footer-link">Tours</a>
              <a [routerLink]="['/shop']" class="footer-link">Shop</a>
              <a [routerLink]="['/contact']" class="footer-link">Contact</a>
            </nav>

            <!-- Socials in Corner (Bottom Right) -->
            <div class="socials-corner">
              <a href="https://facebook.com/ceylondeafadventures" target="_blank" class="social-btn" title="Facebook">
                <!-- Facebook SVG -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com/ceylondeafadventures" target="_blank" class="social-btn" title="Instagram">
                <!-- Instagram SVG -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://youtube.com/@CeylonDeafAdventures" target="_blank" class="social-btn" title="YouTube">
                 <!-- YouTube SVG -->
                 <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                 </svg>
              </a>
              <a href="https://x.com/CeylonDeafAdv" target="_blank" class="social-btn" title="X (Twitter)">
                <!-- X (Twitter) SVG -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/ceylon-deaf-adventures" target="_blank" class="social-btn" title="LinkedIn">
                <!-- LinkedIn SVG -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://tiktok.com/@ceylondeafadventures" target="_blank" class="social-btn" title="TikTok">
                 <!-- TikTok SVG -->
                 <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.24-1.72 1.36-3.92 1.93-6.10 1.58-1.57-.25-3.03-.98-4.22-2.09-1.39-1.3-2.19-3.23-2.18-5.18-.01-1.92.74-3.79 2.05-5.12 1.31-1.32 3.19-2 5.06-1.99v4c-1.87.11-3.19 1.95-2.73 3.79.35 1.39 1.7 2.37 3.14 2.29 1.58-.09 2.75-1.47 2.75-3.07V6.16c-.75-.02-1.5-.02-2.25-.02V.02h3.3z"/>
                 </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      --primary: #0b1f3a;    /* Navy */
      --accent: #f4b416;     /* Yellow */
      display: block;
    }

    .footer {
      background-color: var(--primary);
      color: white;
      border-top: 4px solid var(--accent); /* Yellow Top Line */
      font-family: 'Inter', sans-serif;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .py-8 {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 32px;
      flex-wrap: wrap;
    }

    /* Left Section */
    .brand-section {
      flex: 1;
      min-width: 280px;
    }

    .text-accent {
      color: var(--accent);
    }
    
    .text-gray-400 { color: #9ca3af; }
    .text-gray-300 { color: #d1d5db; }
    .text-gray-500 { color: #6b7280; }

    .icon-xs {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--accent);
    }

    /* Right Section */
    .links-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 32px;
    }

    .footer-nav {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .footer-link {
      color: #e5e7eb;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: var(--accent);
    }

    /* Socials Corner */
    .socials-corner {
      display: flex;
      gap: 12px;
      margin-top: auto;
    }

    .social-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 1rem;
    }

    .social-btn:hover {
      background: var(--accent);
      color: var(--primary);
      transform: translateY(-2px);
    }
    
    .w-5 { width: 1.25rem; }
    .h-5 { height: 1.25rem; }
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }

    /* Responsive */
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .brand-section {
        align-items: center;
        display: flex;
        flex-direction: column;
      }
      
      .links-section {
        align-items: center;
        width: 100%;
        gap: 24px;
      }
      
      .footer-nav {
          justify-content: center;
          gap: 16px;
      }
    }
  `]
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
