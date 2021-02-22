import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user;
  users = [];
  errorMsg;
  userEmail;
  logInForm = this.formBuilder.group({
    email: '',
    password: ''
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

}
