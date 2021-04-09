import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from './auth.service';
import {TokenService} from './token.service';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private cookieService: CookieService,
              private authService: AuthService,
              private tokenService: TokenService,
              public dialog: MatDialog,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Interceptssssss');
    if (this.authService.isUserLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.cookieService.get('AuthTok')
        }
      });
    }
    return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if ((err.status === 401 || err.status === 403) && this.authService.isUserLoggedIn()) {
      this.tokenService.signOut();
      this.dialog.closeAll();
      this.router.navigate(['/']);
      return of(err.message);
    }
    return throwError(err);
  }

}
