import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // перенаправляем на главную страницу если пользователь залогинен
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // если в адресной строке есть, куда возвращать пользователя -- возвращаем туда. Иначе -- на главную страницу '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // удобный getter для простого доступа к полям формы
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // удаляем все оповещания из сервиса оповещаний
    this.alertService.clear();

    // перестаём входить, если форма невалидна
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    // Логируем пользователя
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
