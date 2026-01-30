import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, MatIconModule, MatButtonModule],
  template: `
    <nav class="nav" [class.scrolled]="isScrolled">
      <div class="container">
        <div class="nav-content">
          
          <!-- Logo Section -->
          <a [routerLink]="['/']" class="brand-link">
            <img src="logo.png" alt="Ceylon Deaf Adventures logo" class="logo-img" />
          </a>

          <!-- Desktop Navigation (Centered) -->
          <div class="desktop-menu">
            <a [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
            <a [routerLink]="['/about']" routerLinkActive="active" class="nav-link">About Us</a>
            <a [routerLink]="['/tours']" routerLinkActive="active" class="nav-link">Tours</a>
            <a [routerLink]="['/shop']" routerLinkActive="active" class="nav-link">Shop</a>
            <a [routerLink]="['/blogs']" routerLinkActive="active" class="nav-link">Blog</a>
            <a [routerLink]="['/contact']" routerLinkActive="active" class="nav-link">Contact</a>
          </div>

          <!-- Desktop Actions (Right) -->
          <div class="desktop-actions">
            <a href="https://wa.me/94765535051" target="_blank" class="action-btn whatsapp-btn" title="Chat on WhatsApp">
              <mat-icon>chat</mat-icon>
              <span class="btn-text">WhatsApp</span>
            </a>
            <a [routerLink]="['/tours']" class="action-btn book-btn">
              Book Adventure
            </a>
          </div>

          <!-- Mobile Toggle -->
          <button mat-icon-button (click)="toggleMenu()" class="mobile-toggle" aria-label="Toggle navigation">
            <mat-icon>{{ isOpen ? 'close' : 'menu' }}</mat-icon>
          </button>

        </div>
      </div>

      <!-- Mobile Drawer -->
      <div class="mobile-drawer" [class.open]="isOpen">
        <div class="mobile-links">
          <a [routerLink]="['/']" (click)="closeMenu()" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a [routerLink]="['/about']" (click)="closeMenu()" routerLinkActive="active">About Us</a>
          <a [routerLink]="['/tours']" (click)="closeMenu()" routerLinkActive="active">Tours</a>
          <a [routerLink]="['/shop']" (click)="closeMenu()" routerLinkActive="active">Shop</a>
          <a [routerLink]="['/blogs']" (click)="closeMenu()" routerLinkActive="active">Blog</a>
          <a [routerLink]="['/contact']" (click)="closeMenu()" routerLinkActive="active">Contact</a>
        </div>
        
        <div class="mobile-actions-wrapper">
          <a href="https://wa.me/94765535051" target="_blank" class="mobile-action whatsapp">
            <mat-icon>chat</mat-icon> Chat on WhatsApp
          </a>
          <a [routerLink]="['/tours']" (click)="closeMenu()" class="mobile-action book">
            Book Your Adventure
          </a>
        </div>
      </div>
      
      <!-- Overlay -->
      <div class="overlay" [class.show]="isOpen" (click)="closeMenu()"></div>
    </nav>
  `,
  styles: [`
    :host {
      --nav-height: 90px;
      --primary: #0b1f3a;    /* Navy */
      --accent: #f4b416;     /* Yellow */
      --text: #1f2937;       /* Dark Gray */
      --text-light: #6b7280; /* Light Gray */
      --white: #ffffff;
      display: block;
      height: var(--nav-height); /* Prevent layout shift */
    }

    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--nav-height);
      background-color: var(--white); /* Solid White */
      z-index: 1000;
      transition: box-shadow 0.3s ease;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .nav.scrolled {
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); /* Shadow on scroll only */
    }

    .container {
      max-width: 1400px; /* Wider container for nav */
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    /* --- Logo --- */
    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      z-index: 1002; /* Above mobile menu */
    }

    .logo-img {
      height: 60px;
      width: auto;
      object-fit: contain;
    }

    /* --- Desktop Menu --- */
    .desktop-menu {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-link {
      color: var(--text);
      font-weight: 500;
      font-size: 1rem;
      text-decoration: none;
      position: relative;
      transition: color 0.2s;
      padding: 8px 0;
    }

    .nav-link:hover {
      color: var(--primary);
    }

    .nav-link.active {
      color: var(--primary);
      font-weight: 600;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--accent);
      border-radius: 2px;
    }

    /* --- Desktop Actions --- */
    .desktop-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      padding: 0 20px;
      border-radius: 22px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .whatsapp-btn {
      background-color: transparent;
      color: #25D366;
      border: 1px solid #25D366;
      gap: 8px;
    }

    .whatsapp-btn:hover {
      background-color: #25D366;
      color: white;
    }

    .book-btn {
      background-color: var(--primary);
      color: var(--white);
      box-shadow: 0 4px 6px rgba(11, 31, 58, 0.2);
    }

    .book-btn:hover {
      background-color: #153763; /* Lighter navy */
      transform: translateY(-1px);
    }

    /* --- Mobile Toggle --- */
    .mobile-toggle {
      display: none; /* Hidden on desktop */
      color: var(--text);
      z-index: 1002;
    }

    /* --- Mobile Drawer --- */
    .mobile-drawer {
      position: fixed;
      top: var(--nav-height);
      left: 0;
      width: 100%;
      height: calc(100vh - var(--nav-height));
      background-color: var(--white);
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
      z-index: 1001;
      display: flex;
      flex-direction: column;
      padding: 24px;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    .mobile-drawer.open {
      transform: translateX(0);
    }

    .mobile-links {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }

    .mobile-links a {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      padding: 12px 16px;
      border-radius: 12px;
      transition: background 0.2s;
    }

    .mobile-links a:hover, .mobile-links a.active {
      background-color: #f3f4f6;
      color: var(--primary);
      padding-left: 24px; /* Slide effect */
    }
    
    .mobile-links a.active {
        box-shadow: inset 4px 0 0 var(--accent);
    }

    .mobile-actions-wrapper {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 32px;
    }

    .mobile-action {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 52px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      gap: 12px;
    }

    .mobile-action.whatsapp {
      background-color: #dcfce7;
      color: #166534;
    }

    .mobile-action.book {
      background-color: var(--primary);
      color: white;
    }
    
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }
    
    .overlay.show {
        opacity: 1;
        pointer-events: auto;
    }

    /* --- Responsive Breakpoints --- */
    @media (max-width: 1100px) {
      .desktop-menu, .desktop-actions {
        display: none;
      }
      .mobile-toggle {
        display: block;
      }
    }
    
    @media (max-width: 480px) {
        .btn-text {
            display: none;
        }
    }
  `]
})
export class NavigationComponent {
  isOpen = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }
}