import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment } from '../../environments/environment';

import { User } from '@/_models';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AlertService} from '@/_services/alert.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private alertService: AlertService) { }

  // метод для регистрации пользователей. Передает модель User на API
  register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  // метод для блокировки пользователей. Передает DELETE-запрос на API
  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
  validateRestoreToken(token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/restore-password/${token}`);
  }

  restorePassword(token: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/restore-password/${token}`, {password});
  }
  // метод востановление пароля через емайл
  restorePasswordRequest(email): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/restore-password`, { email })
      .pipe(map( response => {
        this.alertService.success(response.message);
      }));
  }

  getUserData(userID: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${userID}`);
  }

  updateUserData(userID: string, attribute: string, value: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/${userID}`, {attribute, value});
  }
  uploadUserPhoto(uploadData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/upload-photo`, uploadData);
  }
  getUserList(query = '', page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users?query=${query}&page=${page}&limit=${limit}`);
  }
}
