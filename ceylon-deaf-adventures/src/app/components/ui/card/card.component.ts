import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <ng-content />
    </div>
  `
})
export class CardComponent { }

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `
    <div class="card-content">
      <ng-content />
    </div>
  `
})
export class CardContentComponent { }