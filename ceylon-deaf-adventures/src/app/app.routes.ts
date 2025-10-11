import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/user/home-page/home-page.component';
import { ToursPageComponent } from './pages/user/tours-page/tours-page.component';
import { AboutPageComponent } from './pages/user/about-page/about-page.component';
import { ShopPageComponent } from './pages/user/shop-page/shop-page.component';
import { BlogsPageComponent } from './pages/user/blogs-page/blogs-page.component';
import { BlogDetailComponent } from './pages/user/blog-detail/blog-detail.component';
import { ToursListComponent } from './pages/admin/tours-list/tours-list.component';
import { TourAdminComponent } from './pages/admin/tour-admin/tour-admin.component';
import { BlogsListComponent } from './pages/admin/blogs-list/blogs-list.component';
import { BlogAdminComponent } from './pages/admin/blog-admin/blog-admin.component';
import { BookingsListComponent } from './pages/admin/bookings-list/bookings-list.component';
import { UsersListComponent } from './pages/admin/users-list/users-list.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'tours', component: ToursPageComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'shop', component: ShopPageComponent },
    { path: 'blogs', component: BlogsPageComponent },
    { path: 'blogs/:slug', component: BlogDetailComponent },
    {
        path: 'admin',
        children: [
            {
                path: 'login',
                component: AdminLoginComponent,
            },
            {
                path: 'tours',
                component: ToursListComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'tours/new',
                component: TourAdminComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'tours/edit/:id',
                component: TourAdminComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'blogs',
                component: BlogsListComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'blogs/new',
                component: BlogAdminComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'blogs/edit/:id',
                component: BlogAdminComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'bookings',
                component: BookingsListComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'users',
                component: UsersListComponent,
                canActivate: [adminGuard]
            },
            {
                path: '',
                redirectTo: 'tours',
                pathMatch: 'full'
            },
        ],
    },
    { path: '**', redirectTo: '' },
];
