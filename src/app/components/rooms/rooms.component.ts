import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogReactivateRoomComponent} from '../dialog/dialog-reactivate-room/dialog-reactivate-room.component';
import {IRoom} from '../../interfaces/IRoom';
import {DialogDeleteRoomComponent} from '../dialog/dialog-delete-room/dialog-delete-room.component';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {TokenService} from '../../services/token.service';
import { Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Predloha pre zmenu pristupoveho kodu miestnosti
 */
export interface DialogData {
  roomPasscode: string;
}

/** Component pre zoznam miestnosti pouzivatela
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  /** ViewChild pouzity pre to, ak by autor nechcel zmenit pristupovy kod a miestnost by ostala
   * neaktivna, aby sa mohol zase vypnut slider. Dalo by sa aj refreshnut komponent.
   */
  @ViewChild('reactivateRoom') ref: ElementRef;
  private _rooms: IRoom[];
  private room: IRoom;
  private _newPasscodeValue: string;
  private _passcodeExists;
  private _reactivateDialogResult: boolean;

  constructor(private roomService: RoomService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, public dialog: MatDialog, private tokenService: TokenService,
              private snackBar: MatSnackBar) { }

  /** Resfresh needed kontroluje, ci boli urobene zmeny a je trea refreshnut komponent,
   */
  ngOnInit(): void {
    this.roomService.refreshNeeded.subscribe( () => {
      this.getRooms();
    });
    this.getRooms();
  }

  /** Metoda sa pokusi najst vsetky miestnosti pouzivatela, pre zobrazenie ich zoznamu, zoradi ich podla
   * id od najnovsej po najstatrsiu, v pripade ze pouzivatel nebol najdeny, zobrazi sa upozorenie
   */
  getRooms(): Subscription {
    return this.roomService.findUserRooms(Number(this.tokenService.getUserId())).subscribe(data => {
        this.rooms = data;
        this.rooms.sort((a, b) => {
          if (a.idRoom < b.idRoom) {
            return 1;
          }
          if (a.idRoom > b.idRoom) {
            return -1;
          }
          return 0;
        });
    } ,
      error => {
        if (error === 404) {
          this.snackBar.open('Nepodarilo sa nájsť miestnosti používateľa', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
  }

  /** Metoda pre vstup do miestnosti, ulozi do cookies id miestnosti, sekciu pre zobrazenie (konverzácia)
   * a nastavi vstup do miestnosti ako autor. Nastavi tiez predvolene triedenie sprav a presmeruje do miestnosti
   * @param id
   */
  enterRoom(id: number): void {
    this.tokenService.saveRoomId(id.toString());
    this.tokenService.saveSection('0');
    this.tokenService.saveRoomAuthor('true');
    this.tokenService.saveMsgSort('0');
    this.router.navigate(['/room']);
  }

  /** Metoda zisti ci sa pristupovy kod aktualne pouziva, pre zapnutie aktivity miestnosti
   * ak sa kod nepouziva, aktivita miestnosti je upravena, ak nie generuje sa novy prisupovy kod
   * a nasledne sa otvori dialogove okno, so zmenou pristupoveho kodu. Nasledne sa pokusi upravit
   * aktivita miestnosti
   * Nakoniec sa zobrazi prislusne upozornenie
   * @param checkedValue
   * @param roomPasscode
   * @param event
   * @param idRoom
   */
  isPasscodeUsed(checkedValue: boolean, roomPasscode: string, event: MatSlideToggleChange, idRoom: number): void {
    if (checkedValue === true) {
      this.roomService.isPasscodeCurrentlyUsed(roomPasscode).subscribe(
        response => {
          this.passcodeExists = response;
          if (this.passcodeExists !== false) {
            this.newPasscodeValue = roomPasscode + this.generateNewPasscode();
            this.openReactivateDialog(event, idRoom);
          }
          else {
            this.roomService.updateRoomActivity(idRoom).subscribe(data => {
                this.snackBar.open(data.message, 'x', {
                  duration: 2000
                });
              },
              error => {
                if (error === 406) {
                  this.snackBar.open('Nepodarilo sa upraviť aktivitu miestnosti!', 'x', {
                    duration: 2000,
                    panelClass: ['mat-toolbar', 'mat-warn']
                  });
                }
              });
          }
        },
        error => {
            this.snackBar.open('Nepodarilo sa zistiť, či je kód aktuálne používaný!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
        });
    }
    if (checkedValue === false)
    {
      this.roomService.updateRoomActivity(idRoom).subscribe(data => {
        this.snackBar.open(data.message, 'x', {
          duration: 2000
        });
      }, error => {
        if (error === 404) {
          this.snackBar.open('Nepodarilo sa upraviť aktivitu miestnosti!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
    }
  }

  /** Metoda pre generovanie doplnku noveho pristupoveho kodu
   * nehodne sa vygeneruju 3 char-y
   */
  generateNewPasscode(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 3; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /** Metoda pre zobrazenie dialogoveho okna pre zmenu kodu. Pokial pouzivatel v okne potvrdi zmenu kodu,
   * a je odoslana ziadost na zmenu kodu a aktivaciu aktivity miestnosti. Ak akcia prebehla uspesne
   * kod je zmeneny a komponent sa refreshne, pokial nie,aktivita miestosti ostava vypnuta a vypne
   * sa aj zapnuty slider (pomocou event-u)
   * @param event
   * @param idRoom
   */
  openReactivateDialog(event: MatSlideToggleChange, idRoom: number): void {
    const dialogRef = this.dialog.open(DialogReactivateRoomComponent, {
      data: {roomPasscode: this.newPasscodeValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.roomService.getRoom(idRoom).subscribe(
          response => {
            this.room = response;
            this.room.roomPasscode = this.newPasscodeValue;
            this.roomService.updateRoomPasscode(this.room).subscribe(data => {
              this.snackBar.open(data.message, 'x', {
                duration: 2000
              });
            }, error => {
              if (error === 406) {
                this.snackBar.open('Nepodarilo sa upraviť kód miestnosti!', 'x', {
                  duration: 2000,
                  panelClass: ['mat-toolbar', 'mat-warn']
                });
              }
            });
          }, error => {
            if (error === 404) {
              this.snackBar.open('Nepodarilo sa nájsť miestnosť!', 'x', {
                duration: 2000,
                panelClass: ['mat-toolbar', 'mat-warn']
              });
            }
          });
      } else {
        event.source.checked = false;
      }
    });
  }

  /** Metoda pre zmazanie miestnosti. Otvori sa dialogove okno pre zmazanie miestnosti a pokial
   * pouzivatel potvrdi zmazanie miestnosti, odosle ziadost pre zmazanie. Nasledne sa zobrazi
   * prislusne upozornenie
   * @param idRoom
   */
  openDeleteDialog(idRoom: number): void {
    const dialogRef = this.dialog.open(DialogDeleteRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true ) {
        this.roomService.deleteRoom(idRoom).subscribe(data => {
          this.snackBar.open(data.message, 'x', {
            duration: 2000
          });
        }, error => {
          if (error === 404) {
            this.snackBar.open('Nepodarilo sa vymazať miestnosť!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
      }
    });
  }

  /// GETTRE A SETTRE
  get reactivateDialogResult(): boolean {
    return this._reactivateDialogResult;
  }

  set reactivateDialogResult(value: boolean) {
    this._reactivateDialogResult = value;
  }

  get passcodeExists() {
    return this._passcodeExists;
  }

  set passcodeExists(value) {
    this._passcodeExists = value;
  }

  get newPasscodeValue() {
    return this._newPasscodeValue;
  }

  set newPasscodeValue(value) {
    this._newPasscodeValue = value;
  }

  get rooms(): any[] {
    return this._rooms;
  }

  set rooms(value: any[]) {
    this._rooms = value;
  }
}
