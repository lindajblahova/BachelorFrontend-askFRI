import { Component, OnInit } from '@angular/core';
import {IRoom} from '../../../interfaces/IRoom';
import {UserService} from '../../../services/user.service';
import {RoomService} from '../../../services/room.service';
import {DialogDeleteRoomComponent} from '../../../components/dialog/dialog-delete-room/dialog-delete-room.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-all-rooms',
  templateUrl: './all-rooms.component.html',
  styleUrls: ['./all-rooms.component.css']
})
export class AllRoomsComponent implements OnInit {

  private _rooms: IRoom[];
  private _errorMsg;

  constructor(private userService: UserService, private roomService: RoomService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
        error => this.errorMsg = error);
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
  get rooms(): IRoom[] {
    return this._rooms;
  }

  set rooms(value: IRoom[]) {
    this._rooms = value;
  }

  get errorMsg() {
    return this._errorMsg;
  }

  set errorMsg(value) {
    this._errorMsg = value;
  }
}
