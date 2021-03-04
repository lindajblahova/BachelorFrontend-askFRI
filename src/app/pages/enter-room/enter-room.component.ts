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

  private _room;
  private _rooms = [];
  private _passcode;
  private _errorMsg;
  private _passcodeForm = this.formBuilder.group({
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
      this.room = this.rooms.find(room => room.roomPasscode === this.passcode);
      if (this.room !== undefined) {
        this.router.navigate(['/participant-rooms', this._room.idRoom]);
      }
      this.passcodeForm.reset();
    }
  }

  /// GETTERS AND SETTERS
  get passcodeForm(): FormGroup {
    return this._passcodeForm;
  }

  set passcodeForm(value: FormGroup) {
    this._passcodeForm = value;
  }
  get errorMsg() {
    return this._errorMsg;
  }

  set errorMsg(value) {
    this._errorMsg = value;
  }
  get passcode() {
    return this._passcode;
  }

  set passcode(value) {
    this._passcode = value;
  }
  get rooms(): any[] {
    return this._rooms;
  }

  set rooms(value: any[]) {
    this._rooms = value;
  }
  get room() {
    return this._room;
  }

  set room(value) {
    this._room = value;
  }

}
