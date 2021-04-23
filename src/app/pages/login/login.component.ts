import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {regexFineFunction} from '../../validators/regex-validation';
import {TokenService} from '../../services/token.service';
import {ILoginResponse} from '../../interfaces/ILoginResponse';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Component pre prihlasenie pouzivatela
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private _user: ILoginResponse;
  private _logInForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required,
      Validators.minLength(7), regexFineFunction(/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)]],
    password: ['', [Validators.required,
      Validators.minLength(8), regexFineFunction(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
  });

  constructor(private formBuilder: FormBuilder, private router: Router,
              private tokenService: TokenService, private authService: AuthService, private snackBar: MatSnackBar) { }

  /** Metoda pre odoslanie hodnot z prihlasovacieho formulara, pokusi sa prihlasit pouzivatela
   * ak bolo prihlasenie uspesne, do cookies ulozi token pouzivatela, jeho id a rolu. nasledne
   * pouzivatela presmeruje na jeho domovsku stranku, stranky su chranene rolou. Pokial prihlasenie
   * neprebehlo uspesne, zobrazi sa upozornenie
   */
  onSubmit(): void {
    if (this.logInForm.get('email').value !== '' &&  this.logInForm.get('password').value !== '') {

      this.authService.loginUser({email: this.logInForm.get('email').value, password:
        this.logInForm.get('password').value }).subscribe(data => {
        this.user = data;
        if (this.user != null) {
          this.tokenService.saveUserId(this.user.id.toString());
          this.tokenService.saveAuthToken(this.user.token);
          this.tokenService.saveAuthRole(this.user.role);
          if (this.user.role === 'Admin') {
            this.router.navigate(['/adminHome']);
          } else if(this.user.role === 'Vyucujuci') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/enter-room']);
          }
        }
      }, error => {
        if (error === 401 || error === 404) {
          this.snackBar.open('Zadané údaje boli nesprávne!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
    }
  }

  /// GETTRE A SETTRE
  get logInForm(): FormGroup {
    return this._logInForm;
  }

  set logInForm(value: FormGroup) {
    this._logInForm = value;
  }
  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

}
