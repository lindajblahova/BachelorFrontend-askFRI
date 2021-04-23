import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Podmienka pre pristup pouzivatela az po autentifikacii
 * zdroj: https://angular.io/api/router/CanActivate
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router, private snackBar: MatSnackBar) {
  }

  /** Metoda overuje, ci ma pouzivatel pravo pristupu do aktualnej cesty - ci je prihlaseny,
   * a pokial nie, presmeruje ho na login a zobrazi upozornenie
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.auth.isUserLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      this.snackBar.open('Prosím prihláste sa', 'x', {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-accent']
      });
      return false;
    }
  }
}
