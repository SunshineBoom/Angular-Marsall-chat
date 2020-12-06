import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      // проверяем. Если пользователь авторизован -- возвращаем true
      return true;
    }

    // пользователь не вошел на сайт -- мы его отправляем на страницу входа
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
