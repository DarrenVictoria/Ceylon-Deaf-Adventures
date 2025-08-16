// package-selector.component.ts
import { Component, Input } from '@angular/core';
import { Tour } from '../models/tour.model';

@Component({
    selector: 'app-package-selector',
    templateUrl: './package-selector.component.html',
    styleUrls: ['./package-selector.component.css']
})
export class PackageSelectorComponent {
    @Input() tours: Tour[] = [];
    expandedPanelId: string | null = null;

    togglePanel(tourId: string): void {
        this.expandedPanelId = this.expandedPanelId === tourId ? null : tourId;
    }

    getToursByType(type: string): Tour[] {
        return this.tours.filter(tour => tour.type === type);
    }
}