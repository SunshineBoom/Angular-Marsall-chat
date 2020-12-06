import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import validate = WebAssembly.validate;

// Объект в localStorage для хранения зарегистрированных пользователей
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // Оборачиваем в наблюдение данные для имитации вызова API-сервера
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // вызываем материализацию и дематериализацию, чтобы обеспечить задержку даже в случае возникновения ошибки
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/restore-password\/\w+$/) && method === 'GET':
          return validateToken();
        case url.match(/\/users\/restore-password\/\w+s/) && method === 'POST':
          return changePassword();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.endsWith('/users/restore-password') && method === 'POST':
          return restorePassword();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { email, password } = body;
      const user = users.find(x => x.email === email && x.password === password);
      if (!user) return error('Username or password is incorrect');

      return ok({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        token: 'fake-jwt-token'
      })
    }

    function restorePassword() {
      const  { email } = body;
      const user = users.find(x => x.email === email);
      if (!user) { return error('Undefined email'); }

      return ok({
        massage: 'Check your email for next instruction'
      });
     }

    function register() {
      const user = body

      if (users.find(x => x.email === user.email)) {
        // Если уже зщарегистрирован пользователь с таким email -- выдаем ошибку
        return error('Email "' + user.email + '" is already taken');
      }

      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      return ok();
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users);
    }

    function validateToken() {
      return ok();
    }

    function changePassword() {
      return ok();
    }

    function deleteUser() {
      if (!isLoggedIn()) return unauthorized();

      users = users.filter(x => x.id !== idFromUrl());
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
