import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

const TOKEN_KEY = 'AuthToken';
const USERID_KEY = 'AuthUserId';
const AUTHORITIES_KEY = 'AuthRole';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private roles: Array<string> = [];
  authorities: string;
  constructor(private router: Router,
              private cookieService: CookieService) { }

  signOut(): void {
    this.cookieService.deleteAll();
  }

  public saveToken(token: string): void  {
    this.cookieService.delete(TOKEN_KEY);
    this.cookieService.set(TOKEN_KEY, token);
  }

  public getToken(): string {
    return this.cookieService.get(TOKEN_KEY);
  }

  public saveUserId(userId: string): void  {
    this.cookieService.delete(USERID_KEY);
    this.cookieService.set(USERID_KEY, userId);
  }

  public getUserId(): string {
    return this.cookieService.get(USERID_KEY);
  }

  public saveAuthRole(role: string): void  {
    this.cookieService.delete(AUTHORITIES_KEY);
    this.cookieService.set(AUTHORITIES_KEY, role);
  }

  public getAuthorities(): string {
    if (this.cookieService.get(TOKEN_KEY)) {
      return this.cookieService.get(AUTHORITIES_KEY);
    }
  }

  public delete(): void  {
    this.cookieService.deleteAll();
  }
}
