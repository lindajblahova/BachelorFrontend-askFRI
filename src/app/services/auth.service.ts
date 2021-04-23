import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {ILogin} from '../interfaces/ILogin';
import {ILoginResponse} from '../interfaces/ILoginResponse';
import {catchError} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';

/** Service pre autentifikaciu pouzivatela
 * pouziva CookieService z ngx-cookie-service
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private cookieService: CookieService) { }

  /** Metoda ziskanim tokenu z cookies zisti ci je pouzivatel prihlaseny
   * sluzi pre presmerovanie, backend je osetreny tokenom
   * @return boolean
   */
  isUserLoggedIn(): boolean {
    const user = this.cookieService.get('AuthTok');
    return !(user === '');
  }

  /** Metoda ziskani z cookies rolu pouzivatela a zisti ci je pouzivatel vyucujucim
   * sluzi pre presmerovanie, backend je osetreny rolou podla id z tokenu
   * @return boolean
   */
  isUserTeacher(): boolean {
    const role = this.cookieService.get('AuthRole');
    return (role === 'Vyucujuci');
  }

  /** Metoda ziskani z cookies rolu pouzivatela a zisti ci je pouzivatel administrator
   * sluzi pre presmerovanie, backend je osetreny rolou podla id z tokenu
   * @return boolean
   */
  isUserAdmin(): boolean {
    const role = this.cookieService.get('AuthRole');
    return (role === 'Admin');
  }

  /** Metoda pre prihlasenie pouzivatela
   * @param user email a heslo zadane formularom
   * @return ILoginResponse s tokenom zo servera
   */
  loginUser(user: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILogin>('http://localhost:8080/api/login', user).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre odhlasenie pouzivatela
   * @return Observable<null>
   */
  logOutUser(): Observable<null> {
    return this.http.get('http://localhost:8080/api/logout').pipe(catchError(this.errorHandler));
  }

  /** Metoda pre zachytenie erroru
   * @param error
   * @return Observable<any> Vracia status kod z response
   */
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
