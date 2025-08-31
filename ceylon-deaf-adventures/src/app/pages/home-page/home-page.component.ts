import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Users, Award, Globe, Heart, Eye, Mountain, Waves, Camera } from 'lucide-angular';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, CardComponent, CardContentComponent, ButtonComponent],
  template: `
    <!-- Hero Section with background image + dark overlay -->
    <section
      class="relative py-20 lg:py-32"
      style="background-image: url('hero-banner.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;"
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
            <app-button size="lg" variant="outline" class="text-lg px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900">
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
              <div class="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <lucide-icon name="award" class="h-8 w-8 text-primary"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">1st Deaf-Friendly Provider</h3>
              <p class="text-muted-foreground">Sri Lanka's pioneering accessible tourism company</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 min-h-16 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <lucide-icon name="globe" class="h-8 w-8 text-accent"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">8+ Years Experience</h3>
              <p class="text-muted-foreground">Accessible tourism expertise since 2014</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 min-h-16 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <lucide-icon name="users" class="h-8 w-8 text-secondary"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Qualified Deaf Guides</h3>
              <p class="text-muted-foreground">Sign language interpreters & Deaf guides</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 min-h-16 transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <lucide-icon name="heart" class="h-8 w-8 text-primary"></lucide-icon>
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
              <lucide-icon name="globe" class="h-10 w-10 text-primary-foreground"></lucide-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Barrier-Free Experiences</h3>
            <p class="text-muted-foreground">Every tour designed with accessibility at its core</p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto">
              <lucide-icon name="users" class="h-10 w-10 text-accent-foreground"></lucide-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Genuine Community Roots</h3>
            <p class="text-muted-foreground">Founded and operated by the Deaf community</p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-full flex items-center justify-center mx-auto">
              <lucide-icon name="mountain" class="h-10 w-10 text-secondary-foreground"></lucide-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Unforgettable Adventures</h3>
            <p class="text-muted-foreground">Discover Sri Lanka's hidden gems and cultural treasures</p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
              <lucide-icon name="award" class="h-10 w-10 text-primary-foreground"></lucide-icon>
            </div>
            <h3 class="text-xl font-semibold text-foreground">Trusted Worldwide</h3>
            <p class="text-muted-foreground">Recognized by international Deaf organizations</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Tours -->
    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Featured Tours</h2>
          <p class="text-xl text-muted-foreground">
            Discover Sri Lanka's most breathtaking destinations with full accessibility
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-card class="overflow-hidden hover:shadow-xl transition-shadow group">
            <div class="relative">
              <img
                src="/mirissa-whale-watching.png"
                alt="Whale watching tour in Mirissa"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon name="waves" class="h-6 w-6 mb-2"></lucide-icon>
              </div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Whale Watching in Mirissa</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Experience majestic blue whales with sign language marine guides
              </p>
              <app-button variant="outline" class="w-full bg-transparent">
                <a [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden hover:shadow-xl transition-shadow group">
            <div class="relative">
              <img
                src="/sigiriya-rock-fortress.png"
                alt="Sigiriya Rock Fortress tour"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon name="mountain" class="h-6 w-6 mb-2"></lucide-icon>
              </div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Sigiriya Rock Fortress</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Climb the ancient palace with visual storytelling guides
              </p>
              <app-button variant="outline" class="w-full bg-transparent">
                <a [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden hover:shadow-xl transition-shadow group">
            <div class="relative">
              <img
                src="/yala-safari-leopard-elephants.png"
                alt="Yala National Park safari"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon name="camera" class="h-6 w-6 mb-2"></lucide-icon>
              </div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Yala National Park Safari</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Wildlife photography with vibration alerts for animal sightings
              </p>
              <app-button variant="outline" class="w-full bg-transparent">
                <a [routerLink]="['/tours']">Learn More</a>
              </app-button>
            </app-card-content>
          </app-card>

          <app-card class="overflow-hidden hover:shadow-xl transition-shadow group">
            <div class="relative">
              <img
                src="/ella-tea-trek.png"
                alt="Ella Mountain Trek"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon name="mountain" class="h-6 w-6 mb-2"></lucide-icon>
              </div>
            </div>
            <app-card-content class="p-6">
              <h3 class="font-bold text-lg text-foreground mb-2">Ella Mountain Trek</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Scenic hiking through tea plantations with visual trail guides
              </p>
              <app-button variant="outline" class="w-full bg-transparent">
                <a [routerLink]="['/tours']">Learn More</a>
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
            Hear from the global Deaf community about their Sri Lankan adventures
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <app-card class="p-8 text-center">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <img
                  src="/happy-deaf-tourist.png"
                  alt="Guest testimonial"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <p class="text-muted-foreground italic">
                "Finally, a tour company that truly understands our needs. The visual guides made every moment
                accessible and magical."
              </p>
              <div class="font-semibold text-foreground">Sarah M., USA</div>
            </app-card-content>
          </app-card>

          <app-card class="p-8 text-center">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4">
                <img
                  src="/deaf-family-vacation.png"
                  alt="Family testimonial"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <p class="text-muted-foreground italic">
                "Our family vacation was perfect. The kids loved the visual storytelling, and we felt completely
                included throughout."
              </p>
              <div class="font-semibold text-foreground">The Johnson Family, UK</div>
            </app-card-content>
          </app-card>

          <app-card class="p-8 text-center">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4">
                <img
                  src="/deaf-couple-travel.png"
                  alt="Couple testimonial"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <p class="text-muted-foreground italic">
                "Ceylon Deaf Adventures showed us Sri Lanka's beauty in ways we never imagined possible. Truly
                barrier-free travel."
              </p>
              <div class="font-semibold text-foreground">Maria & Carlos, Spain</div>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>
  `
})
export class HomePageComponent { }