import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private router: Router, private authService: AuthService) {
  }

  async checkPermission() {
    // If user is logged-in, then allow user to access current route.
    if (this.authService.isAuth) {
      return true;
    }

    // Not logged-in prevent user from accessing current route and redirect user to login page with the return url.
    this.router.navigateByUrl('login');
    return false;
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkPermission();
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkPermission();
  }
}
