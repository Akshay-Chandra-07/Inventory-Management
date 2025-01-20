import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const accessToken = sessionStorage.getItem('accesstoken');
    const refreshToken = sessionStorage.getItem('refreshtoken');
    if (!(accessToken && refreshToken)) {
      sessionStorage.clear();
      this.router.navigateByUrl('/auth/login');
      return false;
    }
    return true;
  }
}
