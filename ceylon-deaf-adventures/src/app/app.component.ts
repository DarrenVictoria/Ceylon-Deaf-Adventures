import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-background">
      <app-navigation />
      <router-outlet />
      <app-footer />
    </div>
  `
})
export class AppComponent {
  title = 'ceylon-deaf-adventures';
}