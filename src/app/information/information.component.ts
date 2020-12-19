import { Component, OnInit } from '@angular/core';
import {AuthenticationService, UserService, AlertService } from '@/_services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User, Photo } from '@/_models';
import { Router, ActivatedRoute } from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: './information.component.html'
})
export class InformationComponent implements OnInit {
  currentUser: User;
  informationUser: any;
  informationForm: FormGroup;
  formIsActive = false;
  isCurrentUser = false;
  userID: string;
  returnUrl: string;
  newImage: File;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    this.userID = this.route.snapshot.params.userID;

    if (this.currentUser.id === this.userID) {
      this.isCurrentUser = true;
      this.returnUrl = '/';
    }else{
      this.returnUrl = '/chat/' + this.userID;
    }
  }

  get f() { return this.informationForm.controls; }

  ngOnInit(): void {

    this.loadUserInformation();

    this.informationForm = this.formBuilder.group({
      attribute: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  private loadUserInformation(): void
  {
    this.userService.getUserData(this.userID)
      .pipe(first())
      .subscribe(user => this.informationUser = user);
  }

  getEditForm(field: string): void
  {
    if (this.isCurrentUser) {
      this.informationForm.patchValue({attribute: field, value: this.currentUser[field]});
      this.formIsActive = true;
    }
  }
  submitEditForm(event: any): void
  {
    this.userService.updateUserData(this.userID, this.informationForm.controls.attribute.value, event.target.value)
      .pipe(first())
      .subscribe(user => {

        this.informationUser = user;
        this.formIsActive = false;

        if (this.currentUser.id === this.informationUser.id) {
          this.currentUser[this.informationForm.controls.attribute.value] = event.target.value;
          this.authenticationService.updateUserData(this.informationUser);
        }
      });
  }
  imageUpload(event: any): void
  {
    console.log(this.isCurrentUser);
    if (this.isCurrentUser) {
      this.newImage = event.target.files[0];
      const uploadData = new FormData();
      uploadData.append('user-photo', this.newImage, this.newImage.name);

      this.userService.uploadUserPhoto(uploadData)
        .pipe(first())
        .subscribe((userPhoto: Photo) => {
          this.alertService.clear();
          this.informationUser.photo = userPhoto.url;
          if (this.informationUser.id === this.currentUser.id) {
            this.currentUser.photo = userPhoto.url;
          }
          this.authenticationService.updateUserData(this.currentUser);
        },
            error => {
          this.alertService.error(error);
        }
        );
    }
  }
  logout(): void{
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
