import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

const USERID_KEY = 'AuthUId';
const ROOMID_KEY = 'AuthRId';
const MSGSORT_KEY = 'MsgSortId';
const AUTHORITIES_KEY = 'AuthRole';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // private roles: Array<string> = [];
  authorities: string;
  constructor(private router: Router,
              private cookieService: CookieService) { }

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

  public saveMsgSort(msgSort: string): void  {
    this.cookieService.delete(MSGSORT_KEY);
    this.cookieService.set(MSGSORT_KEY, msgSort);
  }

  public getMsgSort(): string {
    return this.cookieService.get(MSGSORT_KEY);
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
