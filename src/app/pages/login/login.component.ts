import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {regexFineFunction} from '../../validators/regex-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user;
  private users = [];
  private errorMsg;
  private userEmail;
  private logInForm = this.formBuilder.group({
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
      console.warn('The submitted code: ', this.logInForm.value);
      this.userEmail = this.logInForm.get('email').value;
      console.log(this.userEmail);
      this.user = this.users.find(room => room.email === this.userEmail);
      console.log(this.user);
      if (this.user != null) {
        this.router.navigate(['/home', this.user.idUser]);
      }
      this.logInForm.reset();
    }
  }

  getLoginForm(): FormGroup {
    return this.logInForm;
}

}
