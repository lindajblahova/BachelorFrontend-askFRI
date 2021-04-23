import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

/** Podmienka pre pristup pouzivatela ak ma rolu vyucujuceho
 * zdroj: https://angular.io/api/router/CanActivate
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  /** Metoda overuje, ci ma pouzivatel pravo pristupu do aktualnej cesty - ci je vyucujucim,
   * a pokial nie, presmeruje ho v pripade administratora na domovsku stranku adminHome a v pripade
   * studenta na domovsku stranku enter-room
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.auth.isUserTeacher()) {
      return true;
    } else if (this.auth.isUserAdmin()){
      this.router.navigate(['/adminHome']);
      return false;
    } else {
      this.router.navigate(['/enter-room']);
      return false;
    }
  }

}
