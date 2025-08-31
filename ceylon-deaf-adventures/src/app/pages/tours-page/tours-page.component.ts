import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Mountain, Waves, Camera, TreePine, Building, Palmtree, Eye, Users, Car, Home } from 'lucide-angular';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-tours-page',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, CardComponent, CardContentComponent, ButtonComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-6">
          <h1 class="text-4xl lg:text-6xl font-bold text-foreground">Accessible Adventures for Everyone</h1>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From whale watching to cultural immersion — discover Sri Lanka barrier-free with expert visual guides and
            sign language interpretation.
          </p>
        </div>
      </div>
    </section>

    <!-- Tour Cards Grid -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Sigiriya Rock Fortress -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Sigiriya Rock Fortress - UNESCO World Heritage Site"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon [name]="'mountain'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">UNESCO Heritage</span>
              </div>
            </div>
            <app-card-content class="p-6 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Sigiriya Rock Fortress</h3>
              <p class="text-muted-foreground">
                Climb the ancient palace with visual storytelling guides who bring 1,500 years of history to life
                through detailed visual narratives.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>

          <!-- Temple of the Sacred Tooth Relic -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Temple of the Sacred Tooth Relic in Kandy"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon [name]="'building'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">Cultural Heritage</span>
              </div>
            </div>
            <app-card-content class="p-6 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Temple of the Sacred Tooth Relic</h3>
              <p class="text-muted-foreground">
                Experience Kandy's most sacred Buddhist temple with cultural interpreters who explain rituals and
                traditions through visual communication.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>

          <!-- Ella Hiking Trails -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Ella hiking trails through tea plantations"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/极 60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon [name]="'tree-pine'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">Mountain Adventure</span>
              </div>
            </div>
            <app-card-content class="p-极 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Ella Hiking Trails</h3>
              <p class="text-muted-foreground">
                Scenic hiking through tea plantations to Little Adam's Peak with visual trail guides and vibration
                alerts for safety.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>

          <!-- Yala National Park Safari -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Yala National Park safari with leopards and elephants"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-极 text-white">
                <lucide-icon [name]="'camera'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">Wildlife Safari</span>
              </div>
            </div>
            <app-card-content class="p-6 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Yala National Park Safari</h3>
              <p class="text-muted-foreground">
                Wildlife photography adventure with vibration alerts for animal sightings and visual identification
                guides for all species.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>

          <!-- Whale Watching in Mirissa -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Whale watching tour in Mirissa with blue whales"
                class="w-full h-64 object-cover group-h极 ver:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon [name]="'waves'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">Marine Adventure</span>
              </div>
            </div>
            <app-card-content class="p-6 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Whale Watching in Mirissa</h3>
              <p class="text-muted-foreground">
                Experience majestic blue whales and dolphins with sign language marine guides and visual whale
                identification charts.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>

          <!-- Galle Fort -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Galle Fort colonial heritage and cafes"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon [name]="'building'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">Colonial Heritage</span>
              </div>
            </div>
            <app-card-content class="p-6 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Galle Fort</h3>
              <p class="text-muted-foreground">
                Explore 400-year-old colonial architecture with historical visual guides and enjoy accessible cafes
                with written menus.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>

          <!-- Dambulla Cave Temple -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Dambulla Cave Temple with ancient Buddhist murals"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon [name]="'mountain'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">Ancient Art</span>
              </div>
            </div>
            <app-card-content class="p-6 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Dambulla Cave Temple</h3>
              <p class="text-muted-foreground">
                Marvel at 2,000-year-old Buddhist murals with art historians who explain the stories through detailed
                visual descriptions.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>

          <!-- Bentota/Mirissa Beaches -->
          <app-card class="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div class="relative">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Bentota and Mirissa tropical beaches"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <lucide-icon [name]="'palmtree'" class="h-8 w-8 mb-2"></lucide-icon>
                <span class="text-sm font-medium">Beach Paradise</span>
              </div>
            </div>
            <app-card-content class="p-6 space-y-4">
              <h3 class="font-bold text-xl text-foreground">Bentota/Mirissa Beaches</h3>
              <p class="text-muted-foreground">
                Relax on pristine tropical beaches with accessible facilities, visual safety guides, and water sports
                with sign language instruction.
              </p>
              <div class="flex justify-between items-center">
                <app-button variant="primary">
                  <a href="#">Book Now</a>
                </app-button>
                <app-button variant="outline">
                  <a href="#">Learn More</a>
                </app-button>
              </div>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Accessibility Highlights -->
    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl极 lg:text-4xl font-bold text-foreground mb-4">Accessibility Highlights</h2>
          <p class="text-xl text-muted-foreground">
            Every tour designed with comprehensive accessibility features
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16极 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'eye'" class="h-8 w-8 text-primary"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Sign Language Guides</h3>
              <p class="text-muted-foreground text-sm">Certified Deaf guides and interpreters for every tour</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'users'" class="h-8 w-8 text-accent"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Visual & Written Guides</h3>
              <p class="text-muted-foreground text-sm">Comprehensive visual materials and written descriptions</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'car'" class="h-8 w-8 text-secondary"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Accessible Transport</h3>
              <p class="text-muted-foreground text-sm">Comfortable vehicles with visual communication systems</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'home'" class="h-8 w-8 text-primary"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Accessible Stays</h3>
              <p class="text-muted-foreground text极 m">Deaf-friendly accommodations with visual alert systems</p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- FAQ Preview -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6极 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p class="text-xl text-muted-foreground">Common questions about our accessible tours</p>
        </div>

        <div class="space-y-6">
          <app-card class="p-6">
            <app-card-content>
              <h3 class="font-semibold text-lg text-foreground mb-3">
                Do I need to know sign language to join your tours?
              </h3>
              <p class="text-muted-foreground">
                Not at all! Our tours welcome both Deaf and hearing guests. We provide sign language interpreters and
                visual guides to ensure everyone can fully participate and enjoy the experience together.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="p-6">
            <app-card-content>
              <h3 class="font-semibold text-lg text-foreground mb-3">
                Are your accommodations fully accessible?
              </h3>
              <p class="text-muted-foreground">
                Yes, all our partner accommodations feature visual alert systems, accessible bathrooms, and staff
                trained in basic sign language. We personally inspect every facility to ensure it meets our
                accessibility standards.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="p-6">
            <app-card-content>
              <h3 class="font-semibold text-lg text-foreground mb-3">
                What safety measures do you have in place?
              </h3>
              <p class="text-muted-foreground">
                Safety is our priority. We use vibration alerts for emergencies, visual safety briefings, buddy
                systems, and our guides are trained in both first aid and Deaf cultural awareness.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="p-6">
            <app-card-content>
              <h3 class="font-semibold text-lg text-foreground mb-3">
                Can you accommodate dietary restrictions?
              </h3>
              <p class="text-muted-foreground">
                We work with restaurants that provide visual menus and can accommodate various dietary needs including
                vegetarian, vegan, halal, and allergy-specific requirements.
              </p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready for Your Sri Lankan Adventure?</h2>
        <p class="text-xl text-muted-foreground mb-8 leading-relaxed">
          Join thousands of satisfied guests who have experienced Sri Lanka without barriers. Your accessible
          adventure awaits!
        </p>
        <app-button size="lg" variant="accent" class="text-lg px-8 py-3">
          <a href="#">Plan Your Adventure Now</a>
        </app-button>
      </div>
    </section>
  `
})
export class ToursPageComponent { }