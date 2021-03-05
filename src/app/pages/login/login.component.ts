import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {regexFineFunction} from '../../validators/regex-validation';
import {IUser} from '../../interfaces/IUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private _user: IUser;
  private _users: IUser[] = [];
  private _errorMsg: string;
  private _userEmail: string;
  private _logInForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required,
      Validators.minLength(7), regexFineFunction(/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)]],
    password: ['', [Validators.required,
      Validators.minLength(8), regexFineFunction(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe(data => this.users = data,
        error => this.errorMsg = error);
  }

  onSubmit(): void {
    if (this.logInForm.get('email').value !== '' &&  this.logInForm.get('password').value !== '') {
      this.userEmail = this.logInForm.get('email').value;
      this.user = this.users.find(user => user.email === this.userEmail);
      if (this.user != null) {
        if (this.user.role === 'Admin') {
          this.router.navigate(['/adminHome', this.user.idUser]);
        } else {
          this.router.navigate(['/home', this.user.idUser]);
        }
      }
      this.logInForm.reset();
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
  get users(): any[] {
    return this._users;
  }

  set users(value: any[]) {
    this._users = value;
  }
  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

}
