import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-background flex flex-col">
      <app-navigation />
      <div class="flex-grow">
        <router-outlet />
      </div>
      <app-footer class="mt-auto" />
    </div>
  `
})
export class AppComponent {
  title = 'ceylon-deaf-adventures';


}