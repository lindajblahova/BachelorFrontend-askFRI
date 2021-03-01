import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RoomService} from '../../services/room.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  showForm = false;
  createRoomForm = this.formBuilder.group({
    roomName: '',
    roomPasscode: ''
  });
  constructor(private router: Router, private roomService: RoomService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  onClick(): void {
    this.showForm = !this.showForm;
  }

  onSubmit(): void {
    this.roomService.addRoom(this.createRoomForm.get('roomName').value, this.createRoomForm.get('roomPasscode').value);
    this.createRoomForm.reset();
    // console.log(this.roomService.getRooms());
    this.onClick();
    // this.router.navigate(['/home']);
  }
}
