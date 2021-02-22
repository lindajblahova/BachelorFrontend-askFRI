import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signUpForm = this.formBuilder.group({
    name: '',
    surname: '',
    email: '',
    password: ''
  });
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
  }

  onSubmit(): void {
    console.warn('The submitted code: ', this.signUpForm.value);
    this.signUpForm.reset();
  }
}
