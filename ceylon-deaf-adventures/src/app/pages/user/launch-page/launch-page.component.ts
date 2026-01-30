import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-launch-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="launch-container">
      <!-- Left Curtain -->
      <div class="curtain curtain-left" [class.open]="curtainsOpen"></div>

      <!-- Right Curtain -->
      <div class="curtain curtain-right" [class.open]="curtainsOpen"></div>

      <!-- Main Content -->
      <div class="launch-content" [class.fade-out]="curtainsOpen">
        <div class="logo-container">
          <img src="/logo-2.png" alt="Ceylon Deaf Adventures Logo" class="logo" />
        </div>

        <h1 class="tagline">
          Where Every <span class="highlight">Adventure</span> Speaks Volumes
        </h1>

        <p class="subtitle">
          Discover Sri Lanka Through Barrier-Free Tourism
        </p>

        <button
          mat-raised-button
          class="launch-button"
          (click)="launch()"
          [disabled]="isLaunching"
        >
          <mat-icon>rocket_launch</mat-icon>
          {{ isLaunching ? 'Launching...' : 'Begin Your Journey' }}
        </button>
      </div>

      <!-- Confetti Canvas -->
      <canvas #confettiCanvas class="confetti-canvas"></canvas>
    </div>
  `,
  styles: [`
    .launch-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: linear-gradient(135deg,
        #061121 0%,    /* Primary dark */
        #0b1f3a 50%,   /* Primary color */
        #f4b416 100%   /* Accent color */
      );
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Curtains */
    .curtain {
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      transition: transform 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 50;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
    }

    .curtain::before {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 50px,
        rgba(0, 0, 0, 0.1) 50px,
        rgba(0, 0, 0, 0.1) 100px
      );
    }

    .curtain-left {
      left: 0;
      transform-origin: left;
    }

    .curtain-left.open {
      transform: translateX(-100%);
    }

    .curtain-right {
      right: 0;
      transform-origin: right;
    }

    .curtain-right.open {
      transform: translateX(100%);
    }

    /* Main Content */
    .launch-content {
      position: relative;
      z-index: 100;
      text-align: center;
      padding: 2rem;
      animation: fadeIn 1s ease-out;
    }

    .launch-content.fade-out {
      animation: fadeOut 0.5s ease-out forwards;
    }

    .logo-container {
      margin-bottom: 2rem;
      animation: floatIn 1.2s ease-out;
    }

    .logo {
      width: 200px;
      height: auto;
      filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
      animation: pulse 2s ease-in-out infinite;
    }

    @media (min-width: 768px) {
      .logo {
        width: 280px;
      }
    }

    .tagline {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.2;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: slideUp 1s ease-out 0.2s both;
    }

    @media (min-width: 768px) {
      .tagline {
        font-size: 3.5rem;
      }
    }

    .highlight {
      background: linear-gradient(135deg, #fed7aa, #f97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
    }

    .subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 3rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      animation: slideUp 1s ease-out 0.4s both;
    }

    @media (min-width: 768px) {
      .subtitle {
        font-size: 1.5rem;
      }
    }

    .launch-button {
      font-size: 1.25rem !important;
      padding: 1rem 3rem !important;
      height: auto !important;
      background: linear-gradient(135deg, #f97316, #fed7aa) !important;
      color: white !important;
      border: none !important;
      border-radius: 50px !important;
      box-shadow: 0 10px 40px rgba(249, 115, 22, 0.4) !important;
      transition: all 0.3s ease !important;
      animation: slideUp 1s ease-out 0.6s both;
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }

    .launch-button:hover:not(:disabled) {
      transform: translateY(-5px) scale(1.05) !important;
      box-shadow: 0 15px 50px rgba(249, 115, 22, 0.6) !important;
    }

    .launch-button:active:not(:disabled) {
      transform: translateY(-2px) scale(1.02) !important;
    }

    .launch-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .launch-button mat-icon {
      font-size: 28px !important;
      width: 28px !important;
      height: 28px !important;
    }

    /* Confetti Canvas */
    .confetti-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 200;
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    @keyframes floatIn {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `]
})
export class LaunchPageComponent implements OnInit, OnDestroy {
  curtainsOpen = false;
  isLaunching = false;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private confetti: Confetti[] = [];
  private animationFrame?: number;

  constructor(private router: Router) { }

  ngOnInit() {
    // Get canvas element after view init
    setTimeout(() => {
      const canvas = document.querySelector('.confetti-canvas') as HTMLCanvasElement;
      if (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  private resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  launch() {
    if (this.isLaunching) return;

    this.isLaunching = true;

    // Start confetti
    this.createConfetti();
    this.animateConfetti();

    // Open curtains after 1 second
    setTimeout(() => {
      this.curtainsOpen = true;
    }, 1000);

    // Navigate to home after curtains open
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2800);
  }

  private createConfetti() {
    const colors = [
      '#0b1f3a', // Primary
      '#f4b416', // Accent
      '#fcd34d', // Accent light
      '#475569', // Secondary
      '#10b981', // Success
      '#facc15', // Gold
    ];

    // Create 150 confetti pieces
    for (let i = 0; i < 150; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -20,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }
  }

  private animateConfetti() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.confetti.forEach((piece, index) => {
      // Update position
      piece.x += piece.velocityX;
      piece.y += piece.velocityY;
      piece.rotation += piece.rotationSpeed;

      // Add gravity
      piece.velocityY += 0.1;

      // Fade out at bottom
      if (piece.y > this.canvas.height - 100) {
        piece.opacity -= 0.02;
      }

      // Draw confetti
      this.ctx.save();
      this.ctx.translate(piece.x, piece.y);
      this.ctx.rotate((piece.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = piece.opacity;
      this.ctx.fillStyle = piece.color;

      // Draw rectangle confetti
      this.ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);

      this.ctx.restore();

      // Remove confetti that's off screen or fully transparent
      if (piece.y > this.canvas.height + 20 || piece.opacity <= 0) {
        this.confetti.splice(index, 1);
      }
    });

    // Continue animation if there's confetti left
    if (this.confetti.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animateConfetti());
    }
  }
}

interface Confetti {
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}
