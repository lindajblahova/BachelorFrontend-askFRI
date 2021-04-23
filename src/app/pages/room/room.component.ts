import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {IRoom} from '../../interfaces/IRoom';
import {TokenService} from '../../services/token.service';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Component pre miestnost obsahuje v template (html) podkomponenty - messages a poll
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  private _isLoggedIn: boolean = false;
  private _room: IRoom;
  private _sectionToDisplay: number;
  private _author: boolean;

  constructor(private roomService: RoomService, private tokenService: TokenService, private authService: AuthService,
              private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) { }

  /** Pri vrtupec do miestnosti je zaznamenane, ci je pouzivatel autorom miestnosti
   * a aku sekciu (konverzacia/ankety) ma aktualne zobrazenu, defaultne je to konverzacia.
   * Pokial pozadovana miestnost nebola najdena, zobrazi sa upozornenie
   */
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this._sectionToDisplay = Number(this.tokenService.getSection());
    this.tokenService.isRoomAuthor() === 'true' ? this._author = true : this._author = false;
    this.roomService.getRoom(Number(this.tokenService.getRoomId())).subscribe( response => this.room = response, error => {
      if (error === 404) {
        this.snackBar.open('Miestnosť nebola nájdená!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre nastavenie aktualne zobrazenej sekcie (konverzacie/ankety)
   * @param num
   */
  setSection(num: number): void {
    this.tokenService.saveSection('' + num);
    this.cdr.detectChanges();
  }

  /// GETTRE A SETTRE
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  get author(): boolean {
    return this._author;
  }

  set author(value: boolean) {
    this._author = value;
  }

  get room() {
    return this._room;
  }

  set room(value) {
    this._room = value;
  }

  get sectionToDisplay(): number {
    return this._sectionToDisplay;
  }

  set sectionToDisplay(value: number) {
    this._sectionToDisplay = value;
  }
}
