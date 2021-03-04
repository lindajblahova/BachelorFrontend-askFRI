import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../services/room.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogReactivateRoomComponent} from '../dialog/dialog-reactivate-room/dialog-reactivate-room.component';
import {IRoom} from '../../interfaces/IRoom';
import {DialogDeleteProfileComponent} from '../dialog/dialog-delete-profile/dialog-delete-profile.component';
import {DialogDeleteRoomComponent} from '../dialog/dialog-delete-room/dialog-delete-room.component';

export interface DialogData {
  roomPasscode: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  private _rooms: IRoom[] = [];
  private _allRooms: IRoom[];
  private _userId: number;
  private _errorMsg: string;
  private _newPasscodeValue: string;
  private _passcodeExists;
  constructor(private roomService: RoomService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = Number(params.get('userId'));
    });

    this.roomService.findUserRooms(this.userId).subscribe(data => this.rooms = data,
                                                           error => this.errorMsg = error);

    this.roomService.getRooms().subscribe(data => this.allRooms = data,
      error => this.errorMsg = error);
  }

  enterRoom(id: number): void {
    this.router.navigate(['/rooms', id]);
  }

  isPasscodeUsed(checkedValue: boolean, roomPasscode: string): void {
    if (checkedValue === true) {
      this.passcodeExists = this.allRooms.find(data => data.roomPasscode === roomPasscode && data.active === true);
      if (this.passcodeExists !== undefined) {
        this.newPasscodeValue = roomPasscode + this.generateNewPasscode();
        this.openReactivateDialog();
      }
      // else ak je passcode v poriadku
      // TODO updatni aktivitu roomky na true
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

  openReactivateDialog(): void {
    const dialogRef = this.dialog.open(DialogReactivateRoomComponent, {
      data: {roomPasscode: this.newPasscodeValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    // TODO ak je vysledok false nastav checked na false??
    // ak je vysledok true tak zmen aktivitu roomky na true
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /// GETTERS AND SETTERS
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
