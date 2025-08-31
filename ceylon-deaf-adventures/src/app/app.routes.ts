import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ToursPageComponent } from './pages/tours-page/tours-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'tours', component: ToursPageComponent },
    { path: 'about', component: AboutPageComponent },
    { path: '**', redirectTo: '' }
];