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
  private _rooms: IRoom[] = [];
  private _allRooms: IRoom[];
  private _userId: number;
  private _errorMsg: string;
  private _newPasscodeValue: string;
  private _passcodeExists;
  private _reactivateDialogResult: boolean;
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

  isPasscodeUsed(checkedValue: boolean, roomPasscode: string, event: MatSlideToggleChange): void {
    if (checkedValue === true) {
      this.passcodeExists = this.allRooms.find(data => data.roomPasscode === roomPasscode && data.active === true);
      if (this.passcodeExists !== undefined) {
        this.newPasscodeValue = roomPasscode + this.generateNewPasscode();
        this.openReactivateDialog(event);
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

  openReactivateDialog(event: MatSlideToggleChange): void {
    const dialogRef = this.dialog.open(DialogReactivateRoomComponent, {
      data: {roomPasscode: this.newPasscodeValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
       // TODO update room active na true a roompasscode na newRoomPasscode
     } else {
        event.source.checked = false;
      }
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
