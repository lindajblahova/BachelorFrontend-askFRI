import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteProfileComponent} from '../../components/dialog/dialog-delete-profile/dialog-delete-profile.component';
import {IUser} from '../../interfaces/IUser';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private _userId: number;
  private _userData: IUser;
  private _isHidden = true;
  private _firstFormGroup: FormGroup = this.formBuilder.group({
    oldPassword: ['', Validators.required]
  });
  private _secondFormGroup: FormGroup  = this.formBuilder.group({
    newPassword: ['', Validators.required]
  });
  private _thirdFormGroup: FormGroup = this.formBuilder.group({
    newPasswordConfirm: ['', Validators.required]
  });

  constructor(private tokenService: TokenService, private userService: UserService, private formBuilder: FormBuilder,
              public dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this._userId = Number(this.tokenService.getUserId());
    this.userService.getUserById(this.userId).subscribe(data => this.userData = data);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteProfileComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
      {
        this.userService.deleteUser(this.userId).subscribe(data => console.log(data));
        this.tokenService.signOut();
        this.router.navigate(['/login']);
      }
    });
  }

  openSnackBar(message: string, action: string):void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  updatePassword(): void {
    this.userService.getUserById(this.userId).subscribe(data => {
      this.userData = data;
      if (this._thirdFormGroup.get('newPasswordConfirm').value ===
          this._secondFormGroup.get('newPassword').value ) {
        console.log(this.userData);
        this.userData.password = this._secondFormGroup.get('newPassword').value;
        console.log(this._secondFormGroup.get('newPassword').value);
        console.log(this.userData);
        this.userService.updateUser(this.userData).subscribe();
        this.openSnackBar('Heslo bolo zmenené.', 'Zavrieť');
      }
    } );
  }

  /// GETTERS AND SETTERS
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
  get userId() {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
  }

}
