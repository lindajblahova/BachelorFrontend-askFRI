import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {regexFineFunction} from '../../validators/regex-validation';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Component pre registraciu pouzivatela
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

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

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router,
              private snackBar: MatSnackBar) { }

  /** Metoda pre registraciu noveho pouzivatela, pokial email obsahuje fakultnu domenu bude mu priradena
   * rola vyucujuceho. Nasledne odosle ziadost na ulozenie pouzivatela, s prislusnymi udajmi a po uspesnej
   * registracii je presmerovany na login, ak nebola registracia vykonana zobrazi sa oznamenie
   */
  createUser(): void {
    if (this.signUpForm.get('email').value.includes('@fri.uniza.sk' || '@fstroj.uniza.sk' || '@fpedas.uniza.sk' ||
                                                    '@fhv.uniza.sk' || '@fbi.uniza.sk' || '@svf.uniza.sk' ||
                                                    '@feit.uniza.sk')) {
      this.role = 'Vyucujuci';
    }
    this.userService.saveUser({idUser: 0, firstname: this.signUpForm.get('name').value,
      surname: this.signUpForm.get('surname').value, email: this.signUpForm.get('email').value,
      password: this.signUpForm.get('password').value, role: this.role}).subscribe(
      response => {
        this.snackBar.open(response.message, 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-accent']
        });
        this.router.navigate(['login']);
      }, error => {
        if (error === 406) {
          this.snackBar.open('Zadaný email je už registrovaný!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
        else if (error === 403) {
          this.snackBar.open('Zadané údaje nesplnali pozadovany format!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
        else if (error === 400) {
          this.snackBar.open('Zadané údaje boli nesprávne!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
  }

  /** Funkcia kontroluje, ci sa zadane heslo zhoduje s potvrdenim hesla
   */
  passwordMatch(): boolean {
    return this.signUpForm.get('password').value === this._signUpForm.get('passwordConfirm').value;
  }

  /// GETTRE A SETTRE
  get signUpForm(): FormGroup {
    return this._signUpForm;
  }

  set signUpForm(value: FormGroup) {
    this._signUpForm = value;
  }
}

