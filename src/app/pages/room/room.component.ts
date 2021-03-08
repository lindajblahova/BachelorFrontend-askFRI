import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {IRoom} from '../../interfaces/IRoom';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  private _userId: number;
  private _rooms: IRoom[] = [];
  private _room: IRoom;
  private _roomId: number;
  private _errorMsg: string;

  constructor(private roomService: RoomService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
        error => this.errorMsg = error);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
      console.log(this.roomId);
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this._userId = Number(params.get('userId'));
      console.log(this._userId);
    });

    console.log(this.rooms);
    this.roomService.findRoom(this.roomId).subscribe(data => this.room = data);
  }

  /// GETTERS AND SETTERS
  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

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
  get rooms(): any[] {
    return this._rooms;
  }

  set rooms(value: any[]) {
    this._rooms = value;
  }
}
