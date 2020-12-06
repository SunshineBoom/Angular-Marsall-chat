import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '@/_services';
import { User } from '@/_models';

import '@/_content/style.css';
import '@/_content/font-awesome.min.css';
import '@/_content/fonts.css';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
