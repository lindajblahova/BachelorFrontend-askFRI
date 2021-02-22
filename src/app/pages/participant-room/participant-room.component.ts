import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../services/room.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-participant-room',
  templateUrl: './participant-room.component.html',
  styleUrls: ['./participant-room.component.css']
})
export class ParticipantRoomComponent implements OnInit {

  rooms = [];
  room;
  roomId;
  errorMsg;
  constructor(private roomService: RoomService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
        error => this.errorMsg = error);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
      console.log(this.roomId);
    });

    console.log(this.rooms);
    this.roomService.findRoom(this.roomId).subscribe(data => this.room = data);
    console.log(this.room);
  }
}
