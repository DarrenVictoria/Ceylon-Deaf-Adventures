import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, CardComponent, CardContentComponent, ButtonComponent],
  template: `
    <!-- Development Notice Popup Modal -->
    <div 
      *ngIf="showDevelopmentNotice" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      (click)="closeDevelopmentNotice()"
    >
      <app-card class="mx-4 max-w-md w-full" (click)="$event.stopPropagation()">
        <app-card-content class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span class="text-orange-500 text-xl">🚧</span>
              </div>
              <h3 class="text-lg font-semibold text-foreground">Development Notice</h3>
            </div>
            <button 
              (click)="closeDevelopmentNotice()"
              class="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              aria-label="Close development notice"
            >
              <mat-icon class="text-xl">close</mat-icon>
            </button>
          </div>
          
          <p class="text-muted-foreground mb-6">
            This website is currently under development. Some features may not be fully functional yet. 
            We appreciate your patience as we work to create the best accessible tourism experience.
          </p>
          
          <div class="flex justify-end space-x-3">
            <app-button (click)="closeDevelopmentNotice()">
              <p class="m-3">Understood</p>
            </app-button>
          </div>
        </app-card-content>
      </app-card>
    </div>

    <!-- Hero Section with background image + dark overlay -->
    <section
      class="relative py-20 lg:py-32"
      style="background-image: url('Main-Banner.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;"
      aria-label="Hero"
    >
      <!-- dark overlay -->
      <div class="absolute inset-0 bg-black/70"></div>

      <!-- content (above overlay) -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-4xl lg:text-6xl font-bold text-white leading-tight">
              The Home of <span class="text-primary">Deaf-Friendly Tourism</span> in Sri Lanka
            </h1>
            <p class="text-xl text-white/90 leading-relaxed">
              Paradise for All Senses. Accessible adventures for the global Deaf community and their families.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
            <app-button size="lg" variant="outline" class="text-lg px-8 py-3  text-white hover:text-gray-900">
              <a [routerLink]="['/tours']">See Our Tours</a>
            </app-button>
          </div>
          </div>
          <div class="relative">
            <img
              src="ayubowan-srilanka.jpg"
              alt="Ceylon Deaf Adventures team welcoming visitors with sign language in beautiful Sri Lankan landscape"
              class="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Key Value Points -->
    <section class="py-16 bg-muted/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-card class="text-center p-6 min-h-16 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/10  mx-auto mb-1 flex items-center justify-center">
                <mat-icon class="text-primary text-xl">emoji_events</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">1st Deaf-Friendly Provider</h3>
              <p class="text-muted-foreground">Sri Lanka's pioneering accessible tourism company</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 min-h-16 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-1 flex items-center justify-center">
                <mat-icon class="text-accent text-xl">public</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">8+ Years Experience</h3>
              <p class="text-muted-foreground">Accessible tourism expertise since 2014</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 min-h-16 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-1 flex items-center justify-center">
                <mat-icon class="text-secondary text-xl">groups</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Qualified Deaf Guides</h3>
              <p class="text-muted-foreground">Sign language interpreters & Deaf guides</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 min-h-16 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-1 flex items-center justify-center">
                <mat-icon class="text-primary text-xl">favorite</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">90%+ Satisfaction</h3>
              <p class="text-muted-foreground">Exceptional guest experiences worldwide</p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Why Travel With Us -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Travel With Us</h2>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience Sri Lanka through barrier-free adventures designed by and for the Deaf community
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto">
              <mat-icon class="text-primary-foreground text-xl">accessibility</mat-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Barrier-Free Experiences</h3>
            <p class="text-muted-foreground">Every tour designed with accessibility at its core</p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto">
              <mat-icon class="text-accent-foreground text-xl">diversity_3</mat-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Genuine Community Roots</h3>
            <p class="text-muted-foreground">Founded and operated by the Deaf community</p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-full flex items-center justify-center mx-auto">
              <mat-icon class="text-secondary-foreground text-xl">landscape</mat-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Unforgettable Adventures</h3>
            <p class="text-muted-foreground">Discover Sri Lanka's hidden gems and cultural treasures</p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
              <mat-icon class="text-primary-foreground text-xl">verified</mat-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Trusted Worldwide</h3>
            <p class="text-muted-foreground">Recognized by international Deaf organizations</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Destinations -->
    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Featured Destinations</h2>
          <p class="text-xl text-muted-foreground">
            Discover Sri Lanka's most breathtaking destinations with full accessibility
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Esala_Perahara.jpg"
                alt="Kandy Esala Perahera festival"
                class="w-full h-48 object-cover  duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">celebration</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Sovindu Rashmika</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Kandy Esala Perahera</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Sri Lankas grandest festival with glowing elephants, dancers, drummers and sacred traditions—an unforgettable cultural spectacle in Kandy.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Ella.jpg"
                alt="Ella misty mountain village"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">landscape</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Lisa</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Ella</h3>
              <p class="text-muted-foreground text-sm mb-4">
                A misty mountain village with tea fields, waterfalls and the iconic Nine Arch Bridge—perfect for hikes and scenic train rides.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Nuwara_Eliya.jpg"
                alt="Nuwara Eliya tea country"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">local_cafe</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Darren Victoria</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Nuwara Eliya (Little England)</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Tea country charm with cool climates, colonial vibes and the worlds finest high-grown Ceylon tea.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="negombo.jpeg"
                alt="Negombo beach and fish market"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">beach_access</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Tristan</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Negombo</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Golden beaches, a bustling fish market and rich colonial heritage—your coastal gateway near Colombo.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Colombo.jpg"
                alt="Colombo city"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">apartment</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Isuru Dev Thilina</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Colombo</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Sri Lankas lively capital with temples, markets, parks, museums and modern city vibes all in one.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Sigiriya.jpg"
                alt="Sigiriya Lion Rock"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">terrain</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Lisa</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Sigiriya (Lion Rock)</h3>
              <p class="text-muted-foreground text-sm mb-4">
                A UNESCO wonder—climb through lion paws to ancient palace ruins and breathtaking views.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Down_South.jpg"
                alt="South coast beaches and Galle Fort"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">beach_access</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Lisa</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Down South</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Beaches, surfing, whale watching, Galle Fort and lush rainforests—the south is where culture meets paradise.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Anuradhapura.jpg"
                alt="Anuradhapura ancient ruins"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">account_balance</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Isuru Dev Thilina</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Anuradhapura</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Sri Lankas ancient capital with sacred stupas, ruins and the legendary Sri Maha Bodhi tree.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Sri_Pada.jpg"
                alt="Adam's Peak sunrise climb"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">hiking</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Nadeesha Fernando</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Adams Peak (Sri Pada)</h3>
              <p class="text-muted-foreground text-sm mb-4">
                A sacred climb to witness sunrise above the clouds—spiritual unity and natural wonder in one.
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden  transition-shadow group">
            <div class="relative">
              <img
                src="/Pollonaruwa.jpg"
                alt="Pollonaruwa ancient ruins"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <mat-icon class="text-2xl">account_balance</mat-icon>
              </div>
              <div class="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">Photo: Isuru Dev Thilina</div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Pollonaruwa</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Polonnaruwa, Sri Lankas medieval capital and a UNESCO World Heritage Site, is renowned for its ancient ruins and remarkable Sinhalese architecture
              </p>
              <app-button class="w-full bg-transparent">
                <a class="m-2" [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>
        </div>

        <div class="text-center mt-12">
          <app-button size="lg" variant="accent">
            <a [routerLink]="['/tours']">View All Tours</a>
          </app-button>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">What Our Guests Say</h2>
          <p class="text-xl text-muted-foreground">
            Hear from the global Deaf and normal guest community about their Sri Lankan adventures
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <app-card class="p-8 text-center">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <img
                  src="/Diede_Hettinga.jpeg"
                  alt="Guest testimonial"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <p class="text-muted-foreground italic">
                "Half a year ago I met praveen and his parents. I stayed with them for a few weeks, I felt super welcome and they were so willing to help with everything. They do everything from their heart and are so talented in what they do. I feel so lucky that I have met them."
              </p>
              <div class="font-semibold mt-4 text-foreground">Diede Hettinga, Netherlands</div>
            </app-card-content>
          </app-card>

          <app-card class="p-8 text-center">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4">
                <img
                  src="/Lisa.jpeg"
                  alt="Family testimonial"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <p class="text-muted-foreground italic">
                "A very nice family, very clean rooms. The owner offers excursions by the day or week, with a chauffeur upon request. I personally experienced a wonderful multi-day tour through northeastern central Sri Lanka with the owner and a chauffeur"
              </p>
              <div class="font-semibold mt-4 text-foreground">Lisa, Germany</div>
            </app-card-content>
          </app-card>

          <app-card class="p-8 text-center">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4">
                <img
                  src="/Pavlic.jpeg"
                  alt="Couple testimonial"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <p class="text-muted-foreground italic">
                "We stayed near the airport on arrival and immediately knew we would return before departure—the warm, welcoming family made it special. Comfortable rooms, thoughtful meals, and their kindness (even taking me to a cricket match) made our stay unforgettable. Wishing them success, health, and continued warmth!"
              </p>
              <div class="font-semibold mt-4 text-foreground">Pavilic, Germany</div>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    
  `
})
export class HomePageComponent {
  showDevelopmentNotice = true;

  closeDevelopmentNotice() {
    this.showDevelopmentNotice = false;
  }
}