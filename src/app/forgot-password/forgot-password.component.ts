import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AlertService, AuthenticationService, UserService} from '@/_services';
import {first} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';

@Component({
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  restorePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  success = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private userService: UserService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.restorePasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
    this.returnUrl = '/login';
  }

  get f() {return this.restorePasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    this.alertService.clear();

    if (this.restorePasswordForm.invalid) {
      return;
    }

    this.loading = true;

    // отправляю запрос на востановленгия пароля
    this.userService.restorePasswordRequest(this.f.emall.value)
      .pipe(first())
      .subscribe(
        data => {
          this.success = true;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
