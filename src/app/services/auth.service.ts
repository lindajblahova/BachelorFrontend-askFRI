import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {ILogin} from '../interfaces/ILogin';
import {ILoginResponse} from '../interfaces/ILoginResponse';
import {catchError} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private cookieService: CookieService) { }

  isUserLoggedIn(): boolean {
    const user = this.cookieService.get('AuthTok');
    return !(user === '');
  }

  isUserTeacher(): boolean {
    const role = this.cookieService.get('AuthRole');
    return (role === 'Vyucujuci');
  }

  isUserAdmin(): boolean {
    const role = this.cookieService.get('AuthRole');
    return (role === 'Admin');
  }

  loginUser(user: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('http://localhost:8080/api/login', user).pipe(catchError(this.errorHandler));;
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
