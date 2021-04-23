import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

const TOKEN_KEY = 'AuthTok';
const USERID_KEY = 'AuthUId';
const ROOMID_KEY = 'AuthRId';
const ROOMAUTHOR_KEY = 'AuthRAut';
const SECTION_KEY = 'SectionId';
const MSGSORT_KEY = 'MsgSort';
const AUTHORITIES_KEY = 'AuthRole';

/** Service pre pracu s Cookies
 * pouziva CookieService z ngx-cookie-service
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router,
              private cookieService: CookieService, private authService: AuthService) { }

  /** Metoda do cookies ulozi JWT
   * @param jwt
   */
  public saveAuthToken(jwt: string): void  {
    this.cookieService.delete(TOKEN_KEY);
    this.cookieService.set(TOKEN_KEY, jwt);
  }

  /** Getter pre JWT
   * @return string jwt
   */
  public getAuthToken(): string {
    return this.cookieService.get(TOKEN_KEY);
  }

  /** Metoda ulozi do Cookies id pouzivatela
   * @param userId
   */
  public saveUserId(userId: string): void  {
    this.cookieService.delete(USERID_KEY);
    this.cookieService.set(USERID_KEY, userId);
  }

  /** Getter pre ID pouzivatela z cookies
   * @return string jwt
   */
  public getUserId(): string {
    return this.cookieService.get(USERID_KEY);
  }

  /** Metoda ulozi do Cookies pouzivatelom zvolene zoradenie sprav v miestnosti
   * @param sortBy
   */
  public saveMsgSort(sortBy: string): void  {
    this.cookieService.delete(MSGSORT_KEY);
    this.cookieService.set(MSGSORT_KEY, sortBy);
  }

  /** Getter pre zoradenie sprav v miestnosti z cookies
   * @return string jwt
   */
  public getMsgSort(): string {
    return this.cookieService.get(MSGSORT_KEY);
  }

  /** Metoda ulozi do Cookies id miestnosti, v ktorej sa pouzivatel nachadza
   * @param roomId
   */
  public saveRoomId(roomId: string): void  {
    this.cookieService.delete(ROOMID_KEY);
    this.cookieService.set(ROOMID_KEY, roomId);
  }

  /** Getter pre id miestnosti z cookies
   * @return string
   */
  public getRoomId(): string {
    return this.cookieService.get(ROOMID_KEY);
  }

  /** Metoda ulozi do Cookies ci je pouzivatel autorom miestnosti, v ktorej sa nachadza
   * @param isAuthor
   */
  public saveRoomAuthor(isAuthor: string): void  {
    this.cookieService.delete(ROOMAUTHOR_KEY);
    this.cookieService.set(ROOMAUTHOR_KEY, isAuthor);
  }

  /** Getter pre zistenie, ci je pouzivatel autorom miestnosti z cookies
   *  tento sposob sluzi na zobrazenie/skrytie roznych veci na stranke ak pouzivatel
   *  je/nie je autor, aj keby sa k skrytym veciam ucastnik dostal, nemoze s nimi pracovat
   *  (napr. mazat spravy z miestnosti), lebo na backende je podmienka, ze to moze robit len autor
   * @return string
   */
  public isRoomAuthor(): string {
    return this.cookieService.get(ROOMAUTHOR_KEY);
  }


  /** Metoda ulozi do Cookies ktoru sekciu (Konverzacia/Ankety) ma pouzivatel aktualne zobrazenu,
   *  sluzi pre pripadny refresh stranky
   * @param sectionToDisplay
   */
  public saveSection(sectionToDisplay: string): void  {
    this.cookieService.delete(SECTION_KEY);
    this.cookieService.set(SECTION_KEY, sectionToDisplay);
  }

  /** Getter pre sekciu (Konverzacia/Ankety), ktoru ma pouzivatel aktualne zobrazenu z cookies
   * @return string
   */
  public getSection(): string {
    return this.cookieService.get(SECTION_KEY);
  }

  /** Metoda ulozi do Cookies rolu pouzivatela po prihlaseni
   *  sluzi pre pripadny zobrazenie linkov v navbare, pripadne presmerovanie
   *  pri pokuse na vstup do neopravnenej stranky, na backende je i tak osetrenie,
   *  aby sa na stranky pouzivatel nedostal, ak by zmenil rolu, je to
   *  taka frontend poistka
   * @param role
   */
  public saveAuthRole(role: string): void  {
    this.cookieService.delete(AUTHORITIES_KEY);
    this.cookieService.set(AUTHORITIES_KEY, role);
  }

  /** Getter pre rolu pouzivatela z cookies
   * @return string
   */
  public getAuthorities(): string {
    return this.cookieService.get(AUTHORITIES_KEY);
  }

  /** Metoda pre odhlasenie pouzivatela, vymaze vsetky aktualne udrziavane cookies
   */
  signOut(): void {
    this.authService.logOutUser();
    this.cookieService.deleteAll();
  }

  leaveRoom(): void {
    this.cookieService.delete(ROOMID_KEY);
    this.cookieService.delete(ROOMAUTHOR_KEY);
    this.cookieService.delete(MSGSORT_KEY);
    this.cookieService.delete(SECTION_KEY);
  }
}
