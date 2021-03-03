import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../services/room.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

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
  constructor(private roomService: RoomService, private userService: UserService, private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
        error => this.errorMsg = error);

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

  /// GETTERS AND SETTERS
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
