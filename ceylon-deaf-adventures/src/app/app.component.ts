import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { AccessibilityPanelComponent } from "./shared/components/accessibility-panel/accessibility-panel.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, AccessibilityPanelComponent],
  template: `
    <div class="min-h-screen bg-white">
      <router-outlet></router-outlet>
      <app-accessibility-panel></app-accessibility-panel>
    </div>
  `,
})
export class AppComponent {
  title = "ceylon-deaf-adventures"
}
