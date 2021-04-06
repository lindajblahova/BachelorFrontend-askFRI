import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogReactivateRoomComponent} from '../dialog/dialog-reactivate-room/dialog-reactivate-room.component';
import {IRoom} from '../../interfaces/IRoom';
import {DialogDeleteProfileComponent} from '../dialog/dialog-delete-profile/dialog-delete-profile.component';
import {DialogDeleteRoomComponent} from '../dialog/dialog-delete-room/dialog-delete-room.component';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Token} from '@angular/compiler';
import {TokenService} from '../../services/token.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

export interface DialogData {
  roomPasscode: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  @ViewChild('reactivateRoom') ref: ElementRef;
  private _rooms: IRoom[];
  private _allRooms: IRoom[];
  room: IRoom;
  private _userId: number;
  private _errorMsg: string;
  private _newPasscodeValue: string;
  private _passcodeExists;
  private _reactivateDialogResult: boolean;

  constructor(private roomService: RoomService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, public dialog: MatDialog, private tokenService: TokenService) { }

  ngOnInit(): void {

    this.roomService.refreshNeeded.subscribe( () => {
      this.getRooms();
    });
    this.getRooms();
  }

  getRooms(): Subscription {
    return this.roomService.findUserRooms(Number(this.tokenService.getUserId())).subscribe(data => this.rooms = data,
      error => this.errorMsg = error);
  }

  enterRoom(id: number): void {
    this.tokenService.saveRoomId('' + id);
    this.tokenService.saveMsgSort('0');
    this.router.navigate(['/room']);
  }

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
            this.roomService.updateRoomActivity(idRoom).subscribe();
          }
        });
    }
    if (checkedValue === false)
    {
      this.roomService.updateRoomActivity(idRoom).subscribe();
    }
  }

  generateNewPasscode(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 3; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

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
            this.roomService.updateRoomPasscode(this.room).subscribe();
          });
      } else {
        event.source.checked = false;
      }
    });
  }

  openDeleteDialog(idRoom: number): void {
    const dialogRef = this.dialog.open(DialogDeleteRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true ) {
        this.roomService.deleteRoom(idRoom).subscribe();
      }
    });
  }

  /// GETTERS AND SETTERS
  get reactivateDialogResult(): boolean {
    return this._reactivateDialogResult;
  }

  set reactivateDialogResult(value: boolean) {
    this._reactivateDialogResult = value;
  }

  get allRooms(): IRoom[] {
    return this._allRooms;
  }

  set allRooms(value: IRoom[]) {
    this._allRooms = value;
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

  get errorMsg() {
    return this._errorMsg;
  }
  set errorMsg(value) {
    this._errorMsg = value;
  }

  get userId() {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
  }
  get rooms(): any[] {
    return this._rooms;
  }

  set rooms(value: any[]) {
    this._rooms = value;
  }
}
