import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Heart, Users, Globe, Eye, Handshake, Star, Target } from 'lucide-angular';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, CardComponent, CardContentComponent, ButtonComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-6">
          <h1 class="text-4xl lg:text-6xl font-bold text-foreground">Connecting Heart and Heritage</h1>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born from a passion to create a world where Deaf travelers can explore freely and fully, Ceylon Deaf
            Adventures bridges cultures and communities through accessible tourism.
          </p>
        </div>
      </div>
    </section>

    <!-- Founder's Story -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h2 class="text-3xl lg:text-4xl font-bold text-foreground">Our Story</h2>
            <div class="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                In 2014, our founder recognized a gap in Sri Lanka's tourism industry – the lack of truly accessible
                experiences for the Deaf community. What started as a personal mission to share Sri Lanka's beauty
                with Deaf friends from around the world has grown into the country's first dedicated Deaf-friendly
                tourism company.
              </p>
              <p>
                Our journey began with simple homestay experiences, where visual communication and cultural immersion
                took precedence over traditional audio-based tours. We discovered that when barriers are removed, the
                connections formed between travelers and local communities become deeper and more meaningful.
              </p>
              <p>
                Today, we're proud to have served over 1,000 Deaf and hearing guests from around the world, each
                carrying home not just memories, but a piece of Sri Lankan warmth and hospitality.
              </p>
            </div>
          </div>
          <div class="relative">
            <img
              src="/ceylon-deaf-adventures-family.png"
              alt="Ceylon Deaf Adventures founder with local Sri Lankan family"
              class="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Mission, Vision, Motto -->
    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <app-card class="text-center p-8 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-6">
              <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'eye'" class="h-10 w-10 text-primary"></lucide-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Vision</h3>
              <p class="text-muted-foreground leading-relaxed">
                To become Asia's #1 Deaf adventure tourism company, setting the global standard for inclusive travel
                experiences that celebrate diversity and cultural exchange.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-6">
              <div class="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'target'" class="h-10 w-10 text-accent"></lucide-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Mission</h3>
              <p class="text-muted-foreground leading-relaxed">
                To uplift lives and foster true belonging through accessible adventure tourism, creating meaningful
                connections between the global Deaf community and Sri Lankan culture.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-6">
              <div class="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'heart'" class="h-10 w-10 text-secondary"></lucide-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Motto</h3>
              <p class="text-muted-foreground leading-relaxed font-semibold text-lg">
                "Travel Without Barriers, Belong Without Bounds"
              </p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Milestones Timeline -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Journey</h2>
          <p class="text-xl text-muted-foreground">Key milestones in creating barrier-free tourism</p>
        </div>

        <div class="space-y-12">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="md:w-1/4 text-center md:text-right">
              <div class="text-3xl font-bold text-primary">2014</div>
            </div>
            <div class="md:w-1/12 flex justify-center">
              <div class="w-4 h-4 bg-primary rounded-full"></div>
            </div>
            <div class="md:w-2/3">
              <app-card class="p-6">
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

          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="md:w-1/4 text-center md:text-right">
              <div class="text-3xl font-bold text-accent">2017</div>
            </div>
            <div class="md:w-1/12 flex justify-center">
              <div class="w-4 h-4 bg-accent rounded-full"></div>
            </div>
            <div class="md:w-2/3">
              <app-card class="p-6">
                <app-card-content>
                  <h3 class="text-xl font-semibold text-foreground mb-2">Deaf-Friendly Homestay</h3>
                  <p class="text-muted-foreground">
                    Established our first fully accessible homestay accommodation with visual communication systems.
                  </p>
                </app-card-content>
              </app-card>
            </div>
          </div>

          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="md:w-1/4 text-center md:text-right">
              <div class="text-3xl font-bold text-secondary">2020</div>
            </div>
            <div class="md:w-1/12 flex justify-center">
              <div class="w-4 h-4 bg-secondary rounded-full"></div>
            </div>
            <div class="md:w-2/3">
              <app-card class="p-6">
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

          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="md:w-1/4 text-center md:text-right">
              <div class="text-3xl font-bold text-primary">2024</div>
            </div>
            <div class="md:w-1/12 flex justify-center">
              <div class="w-4 h-4 bg-primary rounded-full"></div>
            </div>
            <div class="md:w-2/3">
              <app-card class="p-6">
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
    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
          <p class="text-xl text-muted-foreground">The principles that guide everything we do</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'users'" class="h-8 w-8 text-primary"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Inclusivity</h3>
              <p class="text-muted-foreground text-sm">
                Creating spaces where everyone belongs, regardless of hearing ability
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'handshake'" class="h-8 w-8 text-accent"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Respect</h3>
              <p class="text-muted-foreground text-sm">
                Honoring Deaf culture while celebrating Sri Lankan heritage
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'globe'" class="h-8 w-8 text-secondary"></lucide-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Empowerment</h3>
              <p class="text-muted-foreground text-sm">
                Enabling independent exploration and meaningful cultural exchange
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <lucide-icon [name]="'star'" class="h-8 w-8 text-primary"></lucide-icon>
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

    <!-- Team Showcase -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p class="text-xl text-muted-foreground">Passionate professionals dedicated to accessible tourism</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="/sri-lankan-tourism-founder.png" alt="Founder and CEO" class="w-full h-full object-cover" />
              </div>
              <h3 class="font-bold text-lg text-foreground">Founder & CEO</h3>
              <p class="text-muted-foreground text-sm">Visionary leader in accessible tourism</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-24 h-24 bg-accent/10 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="/deaf-tour-guide-sri-lanka.png" alt="Lead Deaf Guide" class="w-full h-full object-cover" />
              </div>
              <h3 class="font-bold text-lg text-foreground">Lead Deaf Guide</h3>
              <p class="text-muted-foreground text-sm">
                Expert in visual storytelling and cultural interpretation
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-24 h-24 bg-secondary/10 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="/sign-language-interpreter-sri-lanka.png"
                  alt="Sign Language Interpreter"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3 class="font-bold text-lg text-foreground">Sign Language Interpreter</h3>
              <p class="text-muted-foreground text-sm">Certified interpreter bridging communication</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="/tourism-operations-manager-sri-lanka.png"
                  alt="Operations Manager"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3 class="font-bold text-lg text-foreground">Operations Manager</h3>
              <p class="text-muted-foreground text-sm">Ensuring seamless accessible travel experiences</p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Impact Stories -->
    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Impact Stories</h2>
          <p class="text-xl text-muted-foreground">Real experiences from our global Deaf community</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <app-card class="p-8">
            <app-card-content class="space-y-6">
              <div class="flex items-center space-x-4">
                <img
                  src="/deaf-student-group.png"
                  alt="Student group"
                  class="w-15 h-15 rounded-full object-cover"
                />
                <div>
                  <h3 class="font-semibold text-foreground">University Deaf Students Association</h3>
                  <p class="text-muted-foreground text-sm">Melbourne, Australia</p>
                </div>
              </div>
              <p class="text-muted-foreground italic leading-relaxed">
                "Our group of 15 Deaf students had the most incredible educational tour. The visual guides helped us
                understand Sri Lankan history and culture in ways we never experienced before. This trip changed how
                we think about accessible travel."
              </p>
            </app-card-content>
          </app-card>

          <app-card class="p-8">
            <app-card-content class="space-y-6">
              <div class="flex items-center space-x-4">
                <img
                  src="/placeholder-bjf16.png"
                  alt="Elderly couple"
                  class="w-15 h-15 rounded-full object-cover"
                />
                <div>
                  <h3 class="font-semibold text-foreground">Robert & Helen</h3>
                  <p class="text-muted-foreground text-sm">Retired Teachers, Canada</p>
                </div>
              </div>
              <p class="text-muted-foreground italic leading-relaxed">
                "After 40 years of teaching Deaf children, we finally found a travel company that truly understands
                our community. Ceylon Deaf Adventures gave us the confidence to explore independently while feeling
                completely supported."
              </p>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-6">Join Us on a Journey Beyond Barriers</h2>
        <p class="text-xl text-muted-foreground mb-8 leading-relaxed">
          Experience Sri Lanka through the lens of accessibility, cultural exchange, and genuine human connection.
        </p>
        <app-button size="lg" variant="accent" class="text-lg px-8 py-3">
          <a [routerLink]="['/tours']">Explore Our Tours Today</a>
        </app-button>
      </div>
    </section>
  `
})
export class AboutPageComponent { }