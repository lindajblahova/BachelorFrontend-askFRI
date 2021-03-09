import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {ILogin} from '../interfaces/ILogin';
import {IJwtResponse} from '../interfaces/IJwtResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private cookieService: CookieService) { }

  isUserLoggedIn(): boolean {
    const user = this.cookieService.get('AuthToken');
    return !(user === '');
  }

  tryLogin(credentials: ILogin): Observable<HttpResponse<IJwtResponse>> {
    return this.http.post<IJwtResponse>('', credentials, {observe: 'response'});
  }
}
