import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, MatIconModule, CardComponent, CardContentComponent, ButtonComponent],
  styles: [`
    mat-icon { width:50px; height:50px; margin-top: 20px;}
  `],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-8">
          <h1 class="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
            Connecting Heart and Heritage
          </h1>
          <p class="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
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
          <app-card class="text-center p-8  transition-shadow">
            <app-card-content class="space-y-6">
              <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <mat-icon class="text-primary text-3xl">visibility</mat-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Vision</h3>
              <p style="margin-top:1rem;" class="text-muted-foreground leading-relaxed">
                To become Asia's #1 Deaf adventure tourism company, setting the global standard for inclusive travel
                experiences that celebrate diversity and cultural exchange.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8  transition-shadow">
            <app-card-content class="space-y-6">
              <div class="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <mat-icon  class="text-accent text-3xl">my_location</mat-icon>
              </div>
              <h3 class="text-2xl font-bold text-foreground">Mission</h3>
              <p style="margin-top:1rem;" class="text-muted-foreground leading-relaxed">
                To uplift lives and foster true belonging through accessible adventure tourism, creating meaningful
                connections between the global Deaf community and Sri Lankan culture.
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8  transition-shadow">
            <app-card-content class="space-y-6">
              <div class="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
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
              <app-card class="p-6 hover:shadow-lg transition-shadow">
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
              <app-card class="p-6 hover:shadow-lg transition-shadow">
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
              <app-card class="p-6 hover:shadow-lg transition-shadow">
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
              <app-card class="p-6 hover:shadow-lg transition-shadow">
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
                <mat-icon class="text-primary text-2xl">groups</mat-icon>
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
                <mat-icon class="text-accent text-2xl">handshake</mat-icon>
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
                <mat-icon class="text-secondary text-2xl">public</mat-icon>
              </div>
              <h3 class="font-bold text-lg text-foreground">Empowerment</h3>
              <p class="text-muted-foreground text-sm">
                Enabling independent exploration and meaningful cultural exchange
              </p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-6 hover:shadow-lg transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Impact</h2>
          <p class="text-xl text-muted-foreground">Numbers that tell our story</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-card class="text-center p-8  transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto">
                <mat-icon class="text-primary-foreground text-2xl">emoji_events</mat-icon>
              </div>
              <div class="text-3xl font-bold text-foreground mb-4 mt-5">1st</div>
              <p class="text-muted-foreground">Deaf-Friendly Provider in Sri Lanka</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8  transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto">
                <mat-icon class="text-accent-foreground text-2xl">schedule</mat-icon>
              </div>
              <div class="text-3xl font-bold text-foreground mb-4 mt-5">10+</div>
              <p class="text-muted-foreground">Years of Experience</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8  transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-full flex items-center justify-center mx-auto">
                <mat-icon class="text-secondary-foreground text-2xl">people</mat-icon>
              </div>
              <div class="text-3xl font-bold text-foreground mb-4 mt-5">1000+</div>
              <p class="text-muted-foreground">Happy Guests Served</p>
            </app-card-content>
          </app-card>

          <app-card class="text-center p-8  transition-shadow">
            <app-card-content class="space-y-4">
              <div class="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
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