import {Component, Input, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-participant-room',
  templateUrl: './participant-room.component.html',
  styleUrls: ['./participant-room.component.css']
})
export class ParticipantRoomComponent implements OnInit {

  private _rooms = [];
  private _room;
  private _roomId;
  private _errorMsg;
  constructor(private roomService: RoomService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
        error => this.errorMsg = error);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
      console.log(this.roomId);
    });

    console.log(this._rooms);
    this.roomService.findRoom(this.roomId).subscribe(data => this.room = data);
    console.log(this.room);
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
  get rooms(): any[] {
    return this._rooms;
  }

  set rooms(value: any[]) {
    this._rooms = value;
  }
}
