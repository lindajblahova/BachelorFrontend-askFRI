import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../services/room.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogReactivateRoomComponent} from '../dialog/dialog-reactivate-room/dialog-reactivate-room.component';

export interface DialogData {
  roomPasscode: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  private _rooms = [];
  private _userId;
  private _errorMsg;
  private _showActions = false;
  private _clickedId = 0;
  private _newPasscodeValue;
  constructor(private roomService: RoomService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = Number(params.get('userId'));
    });

    this.roomService.findUserRooms(this.userId).subscribe(data => this.rooms = data,
                                                           error => this.errorMsg = error);
  }

  onClick(roomId: number): void {
    this.showActions = true;
    this.clickedId = roomId;
  }

  cancel(): void {
    this.showActions = false;
  }

  enterRoom(id: number): void {
    this.clickedId = id;
    this.router.navigate(['/rooms', this.clickedId]);
  }

  isPasscodeUsed(checkedValue: boolean, roomPasscode: string): void {
    if (checkedValue === true) {
      // TODO zisti ci sa passcode uz niekde nepouziva (v aktivnych roomkach)
      // ak ano - if
      this.newPasscodeValue = roomPasscode + this.generateNewPasscode();
      this.openDialog();

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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogReactivateRoomComponent, {
      data: {roomPasscode: this.newPasscodeValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    // TODO ak je vysledok false nastav checked na false??
    // ak je vysledok true tak zmen aktivitu roomky na true
  }

  /// GETTERS AND SETTERS
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

  get clickedId(): number {
    return this._clickedId;
  }

  set clickedId(value: number) {
    this._clickedId = value;
  }
  get showActions(): boolean {
    return this._showActions;
  }

  set showActions(value: boolean) {
    this._showActions = value;
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
