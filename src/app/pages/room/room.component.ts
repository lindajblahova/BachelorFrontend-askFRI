import {Component, Input, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {IRoom} from '../../interfaces/IRoom';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  private _room: IRoom;
  private _roomId: number;
  private _errorMsg: string;

  constructor(private roomService: RoomService, private tokenService: TokenService) { }

  ngOnInit(): void {

    this.roomId = Number(this.tokenService.getRoomId());
    this.roomService.getRoom(this.roomId).subscribe( response => this.room = response);
  }

  /// GETTERS AND SETTERS

  get errorMsg() {
    return this._errorMsg;
  }

  set errorMsg(value) {
    this._errorMsg = value;
  }
  get roomId() {
    return this._roomId;
  }

  set roomId(value) {
    this._roomId = value;
  }
  get room() {
    return this._room;
  }

  set room(value) {
    this._room = value;
  }
}
