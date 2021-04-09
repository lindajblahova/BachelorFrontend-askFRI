import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

const TOKEN_KEY = 'AuthTok';
const USERID_KEY = 'AuthUId';
const ROOMID_KEY = 'AuthRId';
const ROOMAUTHOR_KEY = 'AuthRAut';
const SECTION_KEY = 'SectionId';
const AUTHORITIES_KEY = 'AuthRole';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // private roles: Array<string> = [];
  authorities: string;
  constructor(private router: Router,
              private cookieService: CookieService) { }

  public saveAuthToken(jwt: string): void  {
    this.cookieService.delete(TOKEN_KEY);
    this.cookieService.set(TOKEN_KEY, jwt);
  }

  public getAuthToken(): string {
    return this.cookieService.get(TOKEN_KEY);
  }

  public saveUserId(userId: string): void  {
    this.cookieService.delete(USERID_KEY);
    this.cookieService.set(USERID_KEY, userId);
  }

  public getUserId(): string {
    return this.cookieService.get(USERID_KEY);
  }

  public saveRoomId(roomId: string): void  {
    this.cookieService.delete(ROOMID_KEY);
    this.cookieService.set(ROOMID_KEY, roomId);
  }

  public getRoomId(): string {
    return this.cookieService.get(ROOMID_KEY);
  }

  public saveRoomAuthor(isAuthor: string): void  {
    this.cookieService.delete(ROOMAUTHOR_KEY);
    this.cookieService.set(ROOMAUTHOR_KEY, isAuthor);
  }

  public isRoomAuthor(): string {
    return this.cookieService.get(ROOMAUTHOR_KEY);
  }

  public saveSection(sectionToDisplay: string): void  {
    this.cookieService.delete(SECTION_KEY);
    this.cookieService.set(SECTION_KEY, sectionToDisplay);
  }

  public getSection(): string {
    return this.cookieService.get(SECTION_KEY);
  }

  public saveAuthRole(role: string): void  {
    this.cookieService.delete(AUTHORITIES_KEY);
    this.cookieService.set(AUTHORITIES_KEY, role);
  }

  public getAuthorities(): string {
    return this.cookieService.get(AUTHORITIES_KEY);
  }

  signOut(): void {
    this.cookieService.deleteAll();
  }
}
