import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

/** Podmienka pre pristup pouzivatela ak je administratorom
 * zdroj: https://angular.io/api/router/CanActivate
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  /** Metoda overuje, ci ma pouzivatel pravo pristupu do aktualnej cesty - ci je administratorom,
   * a pokial nie, presmeruje ho na homovsku stranku vyucujuceho(home) alebo studenta(enter-room)
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.auth.isUserAdmin()) {
      return true;
    } else if (this.auth.isUserTeacher()) {
      this.router.navigate(['/home']);
      return false;
    } else {
      this.router.navigate(['/enter-room']);
      return false;
    }
  }

}
