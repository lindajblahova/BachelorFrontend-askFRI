import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {regexFineFunction} from '../../validators/regex-validation';
import {IUser} from '../../interfaces/IUser';
import {TokenService} from '../../services/token.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ILoginResponse} from '../../interfaces/ILoginResponse';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private _user: ILoginResponse;
  private _errorMsg: string;
  private _userEmail: string;
  private _logInForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required,
      Validators.minLength(7), regexFineFunction(/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)]],
    password: ['', [Validators.required,
      Validators.minLength(8), regexFineFunction(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService,
              private tokenService: TokenService, private authService: AuthService) { }

  ngOnInit(): void {

  }

  onSubmit(): void {

      if (this.logInForm.get('email').value !== '' &&  this.logInForm.get('password').value !== '') {
      this.userEmail = this.logInForm.get('email').value;

      this.authService.loginUser({email: this.userEmail, password: this.logInForm.get('password').value }).subscribe(data => {
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
        if (error === 401) {
          this.errorMsg = 'Zadané údaje boli nesprávne!';
        }
      } );
    }
  }


  /// GETTERS AND SETTERS
  get logInForm(): FormGroup {
    return this._logInForm;
  }

  set logInForm(value: FormGroup) {
    this._logInForm = value;
  }
  get userEmail() {
    return this._userEmail;
  }

  set userEmail(value) {
    this._userEmail = value;
  }
  get errorMsg() {
    return this._errorMsg;
  }

  set errorMsg(value) {
    this._errorMsg = value;
  }

  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

}
