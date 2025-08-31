import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
    private settings = new BehaviorSubject<{ captions: boolean, fontSize: 'base' | 'lg', contrast: boolean, reducedMotion: boolean }>({
        captions: true,
        fontSize: 'base',
        contrast: false,
        reducedMotion: false
    });

    constructor() {
        const stored = localStorage.getItem('accessibility');
        if (stored) this.settings.next(JSON.parse(stored));
    }

    updateSetting<K extends keyof typeof this.settings.value>(key: K, value: typeof this.settings.value[K]) {
        const current = this.settings.value;
        current[key] = value;
        this.settings.next(current);
        localStorage.setItem('accessibility', JSON.stringify(current));
        // Apply body classes, e.g., document.body.classList.toggle('high-contrast', value);
    }

    get settings$() {
        return this.settings.asObservable();
    }
}