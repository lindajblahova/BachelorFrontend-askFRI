import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {regexFineFunction} from '../../validators/regex-validation';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorMsg;
  private _signUpForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required,
      Validators.minLength(2), regexFineFunction(/^[a-zA-Zäňôľščťžýáíéúĺśźćŕń ,.'-]+$/)]],
    surname: ['', [Validators.required,
      Validators.minLength(2), regexFineFunction(/^[a-zA-Zäňôľščťžýáíéúĺśźćŕń ,.'-]+$/)]],
    email: ['', [Validators.required,
      Validators.minLength(7), regexFineFunction(/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)]],
    password: ['', [Validators.required,
      Validators.minLength(8), regexFineFunction(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
    passwordConfirm: ['', [Validators.required]],
  });

  users;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router,
              private tokenService: TokenService) { }
  ngOnInit(): void {
  }

  createUser(): void {
    this.userService.saveUser({idUser: 0, firstname: this.signUpForm.get('name').value,
      surname: this.signUpForm.get('surname').value, email: this.signUpForm.get('email').value,
      password: this.signUpForm.get('password').value, role: 'User'}).subscribe(
      response => {
        console.log(response);
        this.tokenService.saveUserId('' + response.idUser);
        console.log(this.tokenService.getUserId());
        this.router.navigate(['home']);
      });
  }

  passwordMatch(): boolean {
    return this.signUpForm.get('password').value === this._signUpForm.get('passwordConfirm').value;
  }

  /// GETTERS AND SETTERS
  get signUpForm(): FormGroup {
    return this._signUpForm;
  }

  set signUpForm(value: FormGroup) {
    this._signUpForm = value;
  }
}

