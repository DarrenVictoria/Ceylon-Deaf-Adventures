// hero-section.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddStayModalComponent } from '../add-stay-modal/add-stay-modal.component';

@Component({
    selector: 'app-hero-section',
    templateUrl: './hero-section.component.html',
    styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {
    constructor(private router: Router, private dialog: MatDialog) { }

    explorePackages() {
        this.router.navigate(['/packages']);
    }

    addDeafFriendlyPlace() {
        this.dialog.open(AddStayModalComponent, {
            width: '90%',
            maxWidth: '600px',
            ariaLabel: 'Add a deaf-friendly place form'
        });
    }
}