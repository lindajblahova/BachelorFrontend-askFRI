import {Component, Input, OnInit} from '@angular/core';
import {IRoom} from '../../../interfaces/IRoom';
import {RoomService} from '../../../services/room.service';
import {DialogDeleteRoomComponent} from '../../../components/dialog/dialog-delete-room/dialog-delete-room.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AdminService} from '../../../services/admin.service';

/** Component pre zoznam vsetkych miestnosti pre admina
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-all-rooms',
  templateUrl: './all-rooms.component.html',
  styleUrls: ['./all-rooms.component.css']
})
export class AllRoomsComponent implements OnInit {

  private _rooms: IRoom[];

  /** Tento atribut je vstupom z rodicovskeho komponentu admin-page
   */
  // INPUT
  private _isAdmin: boolean = false;

  constructor(private roomService: RoomService, private adminService: AdminService, private dialog: MatDialog,
              private snackBar: MatSnackBar ) {
  }

  /** Po vymazani nietorej z miestnosti sa refreshne komponent, preto je tam subscription
   * na refreshNeeded
   */
  ngOnInit(): void {
    this.roomService.refreshNeeded.subscribe(() => {
      this.getRooms();
    });
    this.getRooms();
  }

  /** Metoda pre ziskanie vsetkych miesntnosti
   * Pokusi sa ziskat pole vsetkych miesntnosti. V pripade neuspesnej akcie
   * sa zobrazi prislusne upozornenie
   */
  getRooms(): void {
    this.adminService.getRooms()
      .subscribe(data => this.rooms = data,
        error => {
          if (error === 403)
          {
            this.snackBar.open('Nemáte oprávnenie pre túto akciu!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
  }

  /** Metoda pre vymazanie miesntosti, Otvori dialog pre vymazanie miestnosti a
   * v pripade kladneho vysledku odosle ziadost pre vymazanie miestnosti. Nasledne
   * sa zobrazi prislusne upozornenie o vykonani/nevykonanie akcie
   * @param idRoom
   */
  openDeleteDialog(idRoom: number): void {
    const dialogRef = this.dialog.open(DialogDeleteRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.roomService.deleteRoom(idRoom).subscribe(data => {
          this.snackBar.open('Miestnosť bola vymazaná!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-accent']
          });
        }, error => {
          if (error === 404) {
            this.snackBar.open('Miestnosť sa nepodarilo vymazať!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          } else if (error === 403)
          {
            this.snackBar.open('Nemáte oprávnenie pre túto akciu!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
      }
    });
  }

  /// GETTRE A SETTRE
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  @Input()
  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }

  get rooms(): IRoom[] {
    return this._rooms;
  }

  set rooms(value: IRoom[]) {
    this._rooms = value;
  }
}

