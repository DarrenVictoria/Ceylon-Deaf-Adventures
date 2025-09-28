import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, MatIconModule, CardComponent, CardContentComponent, ButtonComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="text-center space-y-8">
          <h1 class="text-4xl lg-text-6xl font-bold text-foreground leading-tight">
            Connecting Heart and Heritage
          </h1>
          <p style="color:black;" class="text-xl  text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Born from a passion to create a world where Deaf travelers can explore freely and fully, Ceylon Deaf
            Adventures bridges cultures and communities through accessible tourism.
          </p>
        </div>
      </div>
    </section>

    <!-- Founder's Story -->
    <section class="py-20">
      <div class="container">
        <div class="grid-cols-1 lg-grid-cols-2  items-center">
          <div class="space-y-6">
            <h2 class="text-3xl lg-text-4xl font-bold text-foreground">Our Story</h2>
            <div class="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                In 2014, our founder recognized a gap in Sri Lanka's tourism industry the lack of truly accessible
                experiences for the Deaf community. What started as a personal mission to share Sri Lanka's beauty
                with Deaf friends from around the world has grown into the country's first dedicated Deaf-friendly
                tourism company.
              </p>
              <p>
                Our journey began with simple homestay experiences, where visual communication and cultural immersion
                took precedence over traditional audio-based tours. We discovered that when barriers are removed, the
                connections formed between travelers and local communities become deeper and more meaningful.
              </p>
              <p class="font-semibold text-foreground">
                Today, we're proud to have served over 1,000 Deaf and hearing guests from around the world, each
                carrying home not just memories, but a piece of Sri Lankan warmth and hospitality.
              </p>
            </div>
          </div>
          <div class="relative">
            <img
              src="/ceylon-deaf-adventures-family.png"
              alt="Ceylon Deaf Adventures founder with local Sri Lankan family"
              class="img-rounded shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Mission, Vision, Motto -->
    <section class="py-20 bg-muted-30">
      <div class="container">
        <div class="grid-cols-1 md-grid-cols-3 gap-8">
          <app-card class="text-center p-8 transition-shadow">
            <app-card-content class="space-y-6">
              <div class="icon-bg rounded-full flex items-center justify-center mx-auto bg-primary-10">
                <mat-icon class="text-primary text-3xl">visibility</mat-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Vision</h3>
              <p style="margin-top:1rem;" class="text-muted-foreground leading-relaxed">
                To become Asia's #1 Deaf adventure tourism company, setting the global standard for inclusive travel
                experiences that celebrate diversity and cultural exchange.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8 transition-shadow">
            <app-card-content class="space-y-6">
              <div class="icon-bg rounded-full flex items-center justify-center mx-auto bg-accent-10">
                <mat-icon  class="text-accent text-3xl">my_location</mat-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Mission</h3>
              <p style="margin-top:1rem;" class="text-muted-foreground leading-relaxed">
                To uplift lives and foster true belonging through accessible adventure tourism, creating meaningful
                connections between the global Deaf community and Sri Lankan culture.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8 transition-shadow">
            <app-card-content class="space-y-6">
              <div class="icon-bg rounded-full flex items-center justify-center mx-auto bg-secondary-10">
                <mat-icon class="text-secondary text-3xl">favorite</mat-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Motto</h3>
              <p style="margin-top:1rem;" class="text-muted-foreground leading-relaxed font-semibold text-lg">
                "Travel Without Barriers, Belong Without Bounds"
              </p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Milestones Timeline -->
    <section class="py-20">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg-text-4xl font-bold text-foreground mb-4">Our Journey</h2>
          <p class="text-xl text-muted-foreground">Key milestones in creating barrier-free tourism</p>
        </div>

        <div class="space-y-12">
          <div class="flex flex-col md-flex-row items-center gap-8">
            <div class="md-w-1-4 text-center md-text-right">
              <div class="text-3xl font-bold text-primary">2014</div>
            </div>
            <div class="md-w-1-12 flex justify-center">
              <div class="dot bg-primary"></div>
            </div>
            <div class="md-w-2-3">
              <app-card class="p-6 hover-shadow transition-shadow">
                <app-card-content>
                  <h3 class="text-xl font-semibold text-foreground mb-2">First Deaf-Friendly Tours</h3>
                  <p class="text-muted-foreground">
                    Launched our pioneering accessible tourism experiences with visual guides and sign language
                    interpretation.
                  </p>
                </app-card-content>
              </app-card>
            </div>
          </div>

          <div class="flex flex-col md-flex-row items-center gap-8">
            <div class="md-w-1-4 text-center md-text-right">
              <div class="text-3xl font-bold text-accent">2017</div>
            </div>
            <div class="md-w-1-12 flex justify-center">
              <div class="dot bg-accent"></div>
            </div>
            <div class="md-w-2-3">
              <app-card class="p-6 hover-shadow transition-shadow">
                <app-card-content>
                  <h3 class="text-xl font-semibold text-foreground mb-2">Deaf-Friendly Homestay</h3>
                  <p class="text-muted-foreground">
                    Established our first fully accessible homestay accommodation with visual communication systems.
                  </p>
                </app-card-content>
              </app-card>
            </div>
          </div>

          <div class="flex flex-col md-flex-row items-center gap-8">
            <div class="md-w-1-4 text-center md-text-right">
              <div class="text-3xl font-bold text-secondary">2020</div>
            </div>
            <div class="md-w-1-12 flex justify-center">
              <div class="dot bg-secondary"></div>
            </div>
            <div class="md-w-2-3">
              <app-card class="p-6 hover-shadow transition-shadow">
                <app-card-content>
                  <h3 class="text-xl font-semibold text-foreground mb-2">1,000+ Guests Milestone</h3>
                  <p class="text-muted-foreground">
                    Celebrated serving over 1,000 Deaf and hearing guests from around the world with barrier-free
                    experiences.
                  </p>
                </app-card-content>
              </app-card>
            </div>
          </div>

          <div class="flex flex-col md-flex-row items-center gap-8">
            <div class="md-w-1-4 text-center md-text-right">
              <div class="text-3xl font-bold text-primary">2024</div>
            </div>
            <div class="md-w-1-12 flex justify-center">
              <div class="dot bg-primary"></div>
            </div>
            <div class="md-w-2-3">
              <app-card class="p-6 hover-shadow transition-shadow">
                <app-card-content>
                  <h3 class="text-xl font-semibold text-foreground mb-2">International Recognition</h3>
                  <p class="text-muted-foreground">
                    Partnerships with international Deaf organizations and recognition as a leader in accessible
                    tourism.
                  </p>
                </app-card-content>
              </app-card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="py-20 bg-muted-30">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg-text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
          <p class="text-xl text-muted-foreground">The principles that guide everything we do</p>
        </div>

        <div class="grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-8">
          <app-card class="text-center p-6 hover-shadow transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-small rounded-full flex items-center justify-center mx-auto bg-primary-10">
                <mat-icon class="text-primary text-2xl">groups</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Inclusivity</h3>
              <p class="text-muted-foreground text-sm">
                Creating spaces where everyone belongs, regardless of hearing ability
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover-shadow transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-small rounded-full flex items-center justify-center mx-auto bg-accent-10">
                <mat-icon class="text-accent text-2xl">handshake</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Respect</h3>
              <p class="text-muted-foreground text-sm">
                Honoring Deaf culture while celebrating Sri Lankan heritage
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover-shadow transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-small rounded-full flex items-center justify-center mx-auto bg-secondary-10">
                <mat-icon class="text-secondary text-2xl">public</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Empowerment</h3>
              <p class="text-muted-foreground text-sm">
                Enabling independent exploration and meaningful cultural exchange
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover-shadow transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-small rounded-full flex items-center justify-center mx-auto bg-primary-20">
                <mat-icon class="text-primary text-2xl">star</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Excellence</h3>
              <p class="text-muted-foreground text-sm">
                Delivering exceptional experiences that exceed expectations
              </p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="py-20">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg-text-4xl font-bold text-foreground mb-4">Our Impact</h2>
          <p class="text-xl text-muted-foreground">Numbers that tell our story</p>
        </div>

        <div class="grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-8">
          <app-card class="text-center p-8 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-large rounded-full flex items-center justify-center mx-auto bg-gradient-primary">
                <mat-icon class="text-primary-foreground text-2xl">emoji_events</mat-icon>
              </div>
              <div class="text-3xl font-bold text-foreground mb-4 mt-5">1st</div>
              <p class="text-muted-foreground">Deaf-Friendly Provider in Sri Lanka</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-large rounded-full flex items-center justify-center mx-auto bg-gradient-accent">
                <mat-icon class="text-accent-foreground text-2xl">schedule</mat-icon>
              </div>
              <div class="text-3xl font-bold text-foreground mb-4 mt-5">10+</div>
              <p class="text-muted-foreground">Years of Experience</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-large rounded-full flex items-center justify-center mx-auto bg-gradient-secondary">
                <mat-icon class="text-secondary-foreground text-2xl">people</mat-icon>
              </div>
              <div class="text-3xl font-bold text-foreground mb-4 mt-5">1000+</div>
              <p class="text-muted-foreground">Happy Guests Served</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="icon-large rounded-full flex items-center justify-center mx-auto bg-gradient-primary-accent">
                <mat-icon class="text-primary-foreground text-2xl">thumb_up</mat-icon>
              </div>
              <div class="text-3xl font-bold text-foreground mb-4 mt-5">95%</div>
              <p class="text-muted-foreground">Guest Satisfaction Rate</p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="py-20 bg-gradient-primary-accent">
      <div class="max-w-4xl container text-center">
        <h2 class="text-3xl lg-text-4xl font-bold text-foreground mb-6">Join Us on a Journey Beyond Barriers</h2>
        <p class="text-xl text-muted-foreground mb-8 leading-relaxed">
          Experience Sri Lanka through the lens of accessibility, cultural exchange, and genuine human connection.
        </p>
        <app-button size="lg" variant="accent" class="text-lg px-8 py-3">
          <a [routerLink]="['/tours']">Explore Our Tours Today</a>
        </app-button>
      </div>
    </section>
  `,
  styles: [`
    :host {
      --background: 255 255 255;
      --foreground: 17 17 17;
      --muted-foreground: 107 114 128;
      --primary: 45 212 191;
      --primary-foreground: 255 255 255;
      --accent: 249 115 22;
      --accent-foreground: 255 255 255;
      --secondary: 100 116 139;
      --secondary-foreground: 255 255 255;
      --border: 229 231 235;
      --card: 255 255 255;
      --muted: 249 250 251;
    }
    .hero-section {
      position: relative;
      padding-top: 5rem;
      padding-bottom: 5rem;
      background-color: rgba(#4f9153, 0.7);
      
    }
    @media (min-width: 1024px) {
      .hero-section {
        padding-top: 8rem;
        padding-bottom: 8rem;
      }
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
    .text-center {
      text-align: center;
    }
    .space-y-8 {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .text-4xl {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    .lg-text-6xl {
      font-size: 2.25rem;
    }
    @media (min-width: 1024px) {
      .lg-text-6xl {
        font-size: 3.75rem;
        line-height: 1;
      }
    }
    .font-bold {
      font-weight: 700;
    }
    .text-foreground {
      color: rgb(var(--foreground));
    }
    .leading-tight {
      line-height: 1.25;
    }
    .text-xl {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    .text-muted-foreground {
      color: rgb(var(--muted-foreground));
    }
    .max-w-4xl {
      max-width: 64rem;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .leading-relaxed {
      line-height: 1.625;
    }
    .py-20 {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }
    .grid-cols-1 {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    .lg-grid-cols-2 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    @media (min-width: 1024px) {
      .lg-grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    .gap-12 {
      gap: 3rem;
    }
    .items-center {
      align-items: center;
    }
    .space-y-6 {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .lg-text-4xl {
      font-size: 1.875rem;
    }
    @media (min-width: 1024px) {
      .lg-text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
      }
    }
    .space-y-4 {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .font-semibold {
      font-weight: 600;
    }
    .relative {
      position: relative;
    }
    .img-rounded {
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      height: auto;
    }
    .w-full {
      width: 100%;
    }
    .h-auto {
      height: auto;
    }
    .bg-muted-30 {
      background-color: rgba(var(--muted), 0.3);
    }
    .md-grid-cols-3 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    @media (min-width: 768px) {
      .md-grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    .gap-8 {
      gap: 2rem;
    }
    .p-8 {
      padding: 2rem;
    }
    .transition-shadow {
      transition: box-shadow 0.3s ease-in-out;
    }
    .icon-bg {
      width: 5rem;
      height: 5rem;
    }
    .rounded-full {
      border-radius: 9999px;
    }
    .flex {
      display: flex;
    }
    .justify-center {
      justify-content: center;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .bg-primary-10 {
      background-color: rgba(var(--primary), 0.1);
    }
    .text-primary {
      color: rgb(var(--primary));
    }
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .bg-accent-10 {
      background-color: rgba(var(--accent), 0.1);
    }
    .text-accent {
      color: rgb(var(--accent));
    }
    .bg-secondary-10 {
      background-color: rgba(var(--secondary), 0.1);
    }
    .text-secondary {
      color: rgb(var(--secondary));
    }
    .mb-16 {
      margin-bottom: 4rem;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .space-y-12 {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .flex-col {
      flex-direction: column;
    }
    .md-flex-row {
      flex-direction: column;
    }
    @media (min-width: 768px) {
      .md-flex-row {
        flex-direction: row;
      }
    }
    .gap-8 {
      gap: 2rem;
    }
    .md-w-1-4 {
      width: 100%;
      text-align: center;
    }
    @media (min-width: 768px) {
      .md-w-1-4 {
        width: 25%;
        text-align: right;
      }
    }
    .md-text-right {
      text-align: center;
    }
    @media (min-width: 768px) {
      .md-text-right {
        text-align: right;
      }
    }
    .md-w-1-12 {
      width: 100%;
    }
    @media (min-width: 768px) {
      .md-w-1-12 {
        width: 8.333333%;
      }
    }
    .md-w-2-3 {
      width: 100%;
    }
    @media (min-width: 768px) {
      .md-w-2-3 {
        width: 66.666667%;
      }
    }
    .p-6 {
      padding: 1.5rem;
    }
    .hover-shadow:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .text-xl {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    .lg-grid-cols-4 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    @media (min-width: 1024px) {
      .lg-grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
    .icon-small {
      width: 4rem;
      height: 4rem;
    }
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .bg-primary-20 {
      background-color: rgba(var(--primary), 0.2);
    }
    .icon-large {
      width: 5rem;
      height: 5rem;
    }
    .bg-gradient-primary {
      background-image: linear-gradient(to bottom right, rgb(var(--primary)), rgba(var(--primary), 0.7));
    }
    .text-primary-foreground {
      color: rgb(var(--primary-foreground));
    }
    .bg-gradient-accent {
      background-image: linear-gradient(to bottom right, rgb(var(--accent)), rgba(var(--accent), 0.7));
    }
    .text-accent-foreground {
      color: rgb(var(--accent-foreground));
    }
    .bg-gradient-secondary {
      background-image: linear-gradient(to bottom right, rgb(var(--secondary)), rgba(var(--secondary), 0.7));
    }
    .text-secondary-foreground {
      color: rgb(var(--secondary-foreground));
    }
    .bg-gradient-primary-accent {
      background-image: linear-gradient(to bottom right, rgb(var(--primary)), rgb(var(--accent)));
    }
    .mt-5 {
      margin-top: 1.25rem;
    }
    .bg-gradient-primary-accent {
      background-image: linear-gradient(to bottom right, rgba(var(--primary), 0.1), rgba(var(--accent), 0.1));
    }
    .max-w-4xl {
      max-width: 64rem;
    }
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    .mb-8 {
      margin-bottom: 2rem;
    }
    .px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    .dot {
      width: 1rem;
      height: 1rem;
      border-radius: 9999px;
    }
    .bg-primary {
      background-color: rgb(var(--primary));
    }
    .bg-accent {
      background-color: rgb(var(--accent));
    }
    .bg-secondary {
      background-color: rgb(var(--secondary));
    }
  `]
})
export class AboutPageComponent { }