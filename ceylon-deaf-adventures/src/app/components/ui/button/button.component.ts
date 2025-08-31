import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      class="btn"
      [class.btn-lg]="size === 'lg'"
      [class.btn-sm]="size === 'sm'"
      [class.btn-primary]="variant === 'primary'"
      [class.btn-accent]="variant === 'accent'"
      [class.btn-outline]="variant === 'outline'"
      [class.btn-ghost]="variant === 'ghost'"
    >
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  @Input() size: 'sm' | 'default' | 'lg' = 'default';
  @Input() variant: 'primary' | 'accent' | 'outline' | 'ghost' = 'primary';
}