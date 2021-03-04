import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../services/room.service';
import {Router} from '@angular/router';
import {passscodeAlreadyExist} from '../../validators/regex-validation';
import {IRoom} from '../../interfaces/IRoom';
import {IUser} from '../../interfaces/IUser';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  private _newRoom: IRoom;
  private _showForm: boolean = false;

  /// INPUT
  private _owner: number;

  private _createRoomForm: FormGroup = this.formBuilder.group({
    roomName: ['', [Validators.required, Validators.minLength(2)]],
    roomPasscode: ['', [Validators.required, Validators.minLength(2)]],
  });
  constructor(private router: Router, private roomService: RoomService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  showFormChange(): void {
    this.showForm = !this.showForm;
  }

  createRoom(): void {
    if (this.owner !== undefined) {
      this.roomService.saveRoom({idRoom: 0, idOwner: this.owner, roomName: this.createRoomForm.get('roomName').value,
      roomPasscode: this.createRoomForm.get('roomPasscode').value, active: true}).subscribe(
        response => {
          console.log(response);
        });

      this.createRoomForm.reset();
      this.showFormChange();
      this.router.navigate(['/home', this.owner]);
    }
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

  get owner(): number {
    return this._owner;
  }

  @Input()
  set owner(value: number) {
    this._owner = value;
  }

}
