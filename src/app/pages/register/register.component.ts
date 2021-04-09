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

  private _errorMsg;
  private role = 'Student';
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

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }
  ngOnInit(): void {
  }

  createUser(): void {
    if (this.signUpForm.get('email').value.includes('@fri.uniza.sk')) {
      this.role = 'Vyucujuci';
    }
    this.userService.saveUser({idUser: 0, firstname: this.signUpForm.get('name').value,
      surname: this.signUpForm.get('surname').value, email: this.signUpForm.get('email').value,
      password: this.signUpForm.get('password').value, role: this.role}).subscribe(
      response => {
        this.router.navigate(['login']);
      }, error => {
        if (error === 406) {
          this.errorMsg = 'Zadaný email je už registrovaný!';
        }
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

  get errorMsg() {
    return this._errorMsg;
  }

  set errorMsg(value) {
    this._errorMsg = value;
  }
}

