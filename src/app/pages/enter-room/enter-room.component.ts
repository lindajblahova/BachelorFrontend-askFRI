import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RoomService} from '../../services/room.service';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {

  private room;
  private rooms = [];
  private passcode;
  private errorMsg;
  private passcodeForm = this.formBuilder.group({
    passcode: ['', Validators.required],
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
      this.room = this.rooms.find(room => room.roomPasscode === Number(this.passcode));
      this.passcodeForm.reset();
      if (this.room !== undefined) {
        this.router.navigate(['/participant-rooms', this.room.idRoom]);
      }
    }
  }

  getPasscodeForm(): FormGroup {
    return this.passcodeForm;
  }

  getErrorMsg(): FormGroup {
    return this.errorMsg;
  }


}
