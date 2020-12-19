import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment } from '../../environments/environment';

import { User } from '@/_models';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  // метод для регистрации пользователей. Передает модель User на API
  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  // метод для блокировки пользователей. Передает DELETE-запрос на API
  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
  validateRestoreToken(token: string) {
    return this.http.get(`${environment.apiUrl}/users/restore-password/${token}`);
  }

  restorePassword(token: string, password: string) {
    return this.http.post(`${environment.apiUrl}/users/restore-password/${token}`, {password: password});
  }

  getUserData(userID: string) {
    return this.http.get(`${environment.apiUrl}/users/${userID}`);
  }

  updateUserData(userID: string, attribute: string, value: string) {
    return this.http.post(`${environment.apiUrl}/users/${userID}`, {attribute, value});
  }
  uploadUserPhoto(uploadData: FormData) {
    return this.http.post(`${environment.apiUrl}/users/upload-photo`, uploadData);
  }
  getUserList(query = '', page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users?query=${query}&page=${page}&limit=${limit}`);
  }
}
