// stays-section.component.ts
import { Component } from '@angular/core';
import { StaysService } from '../services/stays.service';
import { Stay } from '../models/stay.model';

@Component({
    selector: 'app-stays-section',
    templateUrl: './stays-section.component.html',
    styleUrls: ['./stays-section.component.css']
})
export class StaysSectionComponent {
    stays: Stay[] = [];
    isLoading = true;

    constructor(private staysService: StaysService) { }

    ngOnInit() {
        this.staysService.listStays().subscribe({
            next: (stays) => {
                this.stays = stays;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}