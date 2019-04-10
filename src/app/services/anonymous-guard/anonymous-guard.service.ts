import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Not logged in so return true
    if (!this.authService.isAuth) {
      return true;
    }

    // Logged in so prevent route from changing.
    this.router.navigateByUrl('dash');
    return false;
  }
}
