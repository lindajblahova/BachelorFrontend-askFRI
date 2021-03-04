import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../services/room.service';
import {Router} from '@angular/router';
import {passscodeAlreadyExist} from '../../validators/regex-validation';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  private _showForm = false;
  private _createRoomForm = this.formBuilder.group({
    roomName: ['', [Validators.required, Validators.minLength(2)]],
    roomPasscode: ['', [Validators.required, Validators.minLength(2)]],
  });
  constructor(private router: Router, private roomService: RoomService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  onClick(): void {
    this.showForm = !this.showForm;
  }

  onSubmit(): void {
    this.roomService.addRoom(this.createRoomForm.get('roomName').value);
    this.createRoomForm.reset();
    // console.log(this.roomService.getRooms());
    this.onClick();
    // this.router.navigate(['/home']);
  }

  /// GETTERS AND SETTERS
  get createRoomForm(): FormGroup {
    return this._createRoomForm;
  }

  set createRoomForm(value: FormGroup) {
    this._createRoomForm = value;
  }
  get showForm(): boolean {
    return this._showForm;
  }

  set showForm(value: boolean) {
    this._showForm = value;
  }

}
