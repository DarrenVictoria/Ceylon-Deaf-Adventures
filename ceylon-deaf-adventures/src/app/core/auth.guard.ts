// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const requiredRole = next.data['role'];

        return this.authService.isAdmin$.pipe(
            take(1),
            map(isAdmin => {
                if (requiredRole === 'admin' && !isAdmin) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;
            })
        );
    }
}