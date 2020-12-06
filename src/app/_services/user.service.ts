import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment } from '../../environments/environment';

import { User } from '@/_models';

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
}
