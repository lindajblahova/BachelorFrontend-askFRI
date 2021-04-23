import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteProfileComponent} from '../../components/dialog/dialog-delete-profile/dialog-delete-profile.component';
import {IUser} from '../../interfaces/IUser';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TokenService} from '../../services/token.service';
import {AuthService} from '../../services/auth.service';
import {regexFineFunction} from '../../validators/regex-validation';
import {IUserProfile} from '../../interfaces/IUserProfile';

/** Component pre profil pouzivatela
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private _isLoggedIn: boolean = false;
  private _userData: IUserProfile;
  private _isHidden = true;
  private _firstFormGroup: FormGroup = this.formBuilder.group({
    oldPassword: ['', Validators.required]
  });
  private _secondFormGroup: FormGroup  = this.formBuilder.group({
    newPassword: ['', [Validators.required,
      Validators.minLength(8), regexFineFunction(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]]
  });
  private _thirdFormGroup: FormGroup = this.formBuilder.group({
    newPasswordConfirm: ['', Validators.required]
  });

  constructor(private tokenService: TokenService, private userService: UserService, private formBuilder: FormBuilder,
              public dialog: MatDialog, private snackBar: MatSnackBar, private router: Router,
              private authService: AuthService) { }

  /** Podla id pouzivatela ulozeneho v cookies sa natiahnu jeho udaje, za predpokladu,
   * ze bola odoslana poziadavka pre jeho udaje, nie ineho pouzivatela.
   * Pokial nebol pouzivatel najdeny zobrazi sa oznamenie
   */
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.userService.getUserById(Number(this.tokenService.getUserId())).subscribe(data => this.userData = data, error => {
      if (error === 404) {
        this.snackBar.open('Používateľ neboj nájdený!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda otvori dialogove okno pre zmazanie pouzivatela, po zatvoreni okna sa precita
   * vysledok (true/false) a ak je vysledok true, vymaze sa profil pouzivatela, pouzivatel sa odhlasi
   * a vymazu sa jeho cookies, je presmerovany na login a nasledne sa zobrazi upozornenie o vymazani
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteProfileComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
      {
        this.router.navigate(['/login']);
        this.userService.deleteUser(Number(this.tokenService.getUserId())).subscribe(data => {
          this.snackBar.open(data.message, 'x', {
            duration: 2000,
          });
        }, error => {
          if (error === 404) {
            this.snackBar.open('Používateľa sa nepodarilo vymazať!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
        this.authService.logOutUser();
        this.tokenService.signOut();
      }
    });
  }

  /** Metoda pre update hesla pouzivatela, v pripade ze sa nove heslo rovna potvrdeniu hesla odosle update
   * so starym heslom a novym heslom po vykonani update, ak bolo stare heslo spravne a nove platne zobrazi
   * upozornenie o zmene hesla, inac zobrazi upozornenie o nezmeneni hesla s prislusnou spravou
   */
  updatePassword(): void {
    if (this._thirdFormGroup.get('newPasswordConfirm').value ===
      this._secondFormGroup.get('newPassword').value ) {
      this.userService.updateUser({idUser: Number(this.tokenService.getUserId()),
        oldPassword: this._firstFormGroup.get('oldPassword').value,
      newPassword: this._secondFormGroup.get('newPassword').value}).subscribe(data1 => {
          this.snackBar.open(data1.message, 'x', {
            duration: 2000
          });
      }, error =>
        {
          if (error === 406)
          {
            this.snackBar.open('Aktuálne heslo bolo nesprávne! Heslo nebolo zmenené!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
            this._isHidden = false;
          } else if (error === 404) {
            this.snackBar.open('Heslo nebolo zmenené!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
            this._isHidden = false;
          }
          else if (error === 403) {
            this.snackBar.open('Nove heslo nesplnalo poziadavky!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
            this._isHidden = false;
          }
        });
    } else {
      this.snackBar.open('Nové heslo sa nezhodovalo s potvrdením! Heslo nebolo zmenené!', 'x', {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      this._isHidden = false;
    }
  }

  /// GETTRE A SETTRE
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  get thirdFormGroup(): FormGroup {
    return this._thirdFormGroup;
  }

  set thirdFormGroup(value: FormGroup) {
    this._thirdFormGroup = value;
  }
  get secondFormGroup(): FormGroup {
    return this._secondFormGroup;
  }

  set secondFormGroup(value: FormGroup) {
    this._secondFormGroup = value;
  }
  get firstFormGroup(): FormGroup {
    return this._firstFormGroup;
  }

  set firstFormGroup(value: FormGroup) {
    this._firstFormGroup = value;
  }
  get isHidden(): boolean {
    return this._isHidden;
  }

  set isHidden(value: boolean) {
    this._isHidden = value;
  }
  get userData() {
    return this._userData;
  }

  set userData(value) {
    this._userData = value;
  }

}
