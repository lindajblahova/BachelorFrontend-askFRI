import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {RoomService} from '../../services/room.service';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {

  room;
  rooms = [];
  passcode;
  errorMsg;
  passcodeForm = this.formBuilder.group({
    passcode: '',
  });
  constructor(private formBuilder: FormBuilder, private roomService: RoomService,  private router: Router) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
                error => this.errorMsg = error);
  }

  onSubmit(): void {
    if (this.passcodeForm.get('passcode').value !== '') {
      this.passcode = this.passcodeForm.get('passcode').value;
      console.warn('The submitted code: ', this.passcode);
      this.room = this.rooms.find(room => room.roomPasscode === Number(this.passcode));
      console.warn('The submitted code: ', this.room);
      console.warn('The submitted code: ', this.room.idRoom);
      this.passcodeForm.reset();
      this.router.navigate(['/participant-rooms', this.room.idRoom]);
    }

  }
}
