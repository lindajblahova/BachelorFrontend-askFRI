import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {IRoom} from '../../interfaces/IRoom';
import {TokenService} from '../../services/token.service';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Component pre vstup do miestnosti
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {

  private _room: IRoom;
  private _passcodeForm: FormGroup = this.formBuilder.group({
    passcode: ['', Validators.required],
  });

  private _isLoggedIn: boolean = false;

  constructor(private formBuilder: FormBuilder, private roomService: RoomService,  private router: Router,
              private tokenService: TokenService, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
  }

  /** Metoda pre vstup do miestnosti, pokial pristupovy kod miestnosti
   * nie je prazdny, pokusi sa najst miestnost podla zadaneho pristupoveho kodu
   * ak je miestnost najdena, do cookies sa ulozi jej id, sekcia pre zobrazenie(konverzacia)
   * a to, ze pouzivatel nie je v miestnosti ako autor. nasledne je presmerovany do miestnosti
   */
  onSubmit(): void {
    if (this.passcodeForm.get('passcode').value !== '') {
      this.roomService.getActiveRoomByPasscode(this.passcodeForm.get('passcode').value).subscribe(data => {
        this.room = data;
        if (this.room !== null) {
          this.tokenService.saveRoomId('' + this.room.idRoom);
          this.tokenService.saveSection('0');
          this.tokenService.saveRoomAuthor('false');
          this.tokenService.saveMsgSort('0');
          this.router.navigate(['/room']);
        }
      }, error => {
      if (error === 404) {
        this.snackBar.open('Zadaná miestnosť neexistuje!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }});
      this.passcodeForm.reset();
    }
  }

  /// GETTRE A SETTRE
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  get passcodeForm(): FormGroup {
    return this._passcodeForm;
  }

  set passcodeForm(value: FormGroup) {
    this._passcodeForm = value;
  }

  get room() {
    return this._room;
  }

  set room(value) {
    this._room = value;
  }

}
