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

  rooms = [];
  userId;
  errorMsg;
  showActions = false;
  clickedId = 0;
  constructor(private roomService: RoomService, private userService: UserService, private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
        error => this.errorMsg = error);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = Number(params.get('userId'));
      console.log(this.userId);
    });

    this.roomService.findUserRooms(this.userId).subscribe(data => this.rooms = data);
    console.log(this.rooms);
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
}
