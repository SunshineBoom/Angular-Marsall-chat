import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';
import {AlertService} from '@/_services/alert.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private alertService: AlertService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  updateUserData(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  login(email, password) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
      .pipe(map(user => {
        // сохраняем пользователя внутри localStorage, что бы он оставался авторизированным даже при перезагрузке страниц
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  restorePassword(email) {
    return this.http.post<any>(`${environment.apiUrl}/users/restore-password`, { email })
      .pipe(map( response => {
      this.alertService.success(response.message);
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
