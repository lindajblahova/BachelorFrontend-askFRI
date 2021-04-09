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
  private _sectionToDisplay: number;
  private _author: boolean;

  constructor(private roomService: RoomService, private tokenService: TokenService) { }

  ngOnInit(): void {

    this._sectionToDisplay = Number(this.tokenService.getSection());
    this.tokenService.isRoomAuthor() === 'true' ? this._author = true : this._author = false;
    this.roomId = Number(this.tokenService.getRoomId());
    this.roomService.getRoom(this.roomId).subscribe( response => this.room = response, error => {
      if (error === 401) {
        this.errorMsg = 'Miestnosť nebola nájdená!';
      }
    });
  }


  setSection(num: number): void {
    this.tokenService.saveSection('' + num);
    console.log(num) ;
  }
  /// GETTERS AND SETTERS
  get author(): boolean {
    return this._author;
  }

  set author(value: boolean) {
    this._author = value;
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

  get sectionToDisplay(): number {
    return this._sectionToDisplay;
  }

  set sectionToDisplay(value: number) {
    this._sectionToDisplay = value;
  }
}
