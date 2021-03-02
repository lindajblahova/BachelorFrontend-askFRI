import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {regexFineFunction} from '../../validators/regex-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private signUpForm = this.formBuilder.group({
    name: ['', [Validators.required,
      Validators.minLength(2), regexFineFunction(/^[a-zA-Zäňôľščťžýáíéúĺśźćŕń ,.'-]+$/)]],
    surname: ['', [Validators.required,
      Validators.minLength(2), regexFineFunction(/^[a-zA-Zäňôľščťžýáíéúĺśźćŕń ,.'-]+$/)]],
    email: ['', [Validators.required,
      Validators.minLength(7), regexFineFunction(/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)]],
    password: ['', [Validators.required,
      Validators.minLength(8), regexFineFunction(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
  });
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
  }

  onSubmit(): void {
    console.warn('The submitted code: ', this.signUpForm.value);
    this.signUpForm.reset();
  }

  getsignUpForm(): FormGroup {
    return this.signUpForm;
  }
}

