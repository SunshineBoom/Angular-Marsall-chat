import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '@/_helpers';
import { first } from 'rxjs/operators';
import { UserService, AlertService } from '@/_services';
import {error} from '@angular/compiler/src/util';

@Component({
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {

  loading = false;
  submitted = false;
  changePasswordForm: FormGroup;
  token: string;
  isValidToken: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.token = this.route.snapshot.queryParams['token'];

    this.userService.validateRestoreToken(this.token)
      .pipe(first())
      .subscribe(
        data => {
          this.isValidToken = true;
        },
        error => {
          this.alertService.error(error);
          this.isValidToken = false;
        });
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      restorePassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.changePasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    this.alertService.clear();

    if (this.changePasswordForm.invalid) {
      return;
    }
    this.loading = true;

    this.userService.restorePassword(this.token, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Password restored', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error.message);
          this.loading = false;
        });
  }
}
