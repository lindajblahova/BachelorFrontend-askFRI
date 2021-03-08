import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {IRoom} from '../../interfaces/IRoom';
import {IUser} from '../../interfaces/IUser';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {

  private _userId: number;
  private _userData: IUser;
  private _room: IRoom;
  private _rooms: IRoom[] = [];
  private _passcode: string;
  private _errorMsg: string;
  private _passcodeForm: FormGroup = this.formBuilder.group({
    passcode: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private roomService: RoomService,  private router: Router,
              private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.roomService.getRooms()
      .subscribe(data => this.rooms = data,
                error => this.errorMsg = error);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = Number(params.get('userId'));
      console.log(this.userId);
    });

    this.userService.getUserById(this.userId).subscribe(data => this.userData = data);
  }

  onSubmit(): void {
    if (this.passcodeForm.get('passcode').value !== '') {
      this.passcode = this.passcodeForm.get('passcode').value;
      this.room = this.rooms.find(room => room.roomPasscode === this.passcode);
      if (this.room !== undefined) {
        this.router.navigate(['/participant-rooms', this._userId, this._room.idRoom]);
      }
      this.passcodeForm.reset();
    }
  }

  /// GETTERS AND SETTERS
  get userData(): IUser {
    return this._userData;
  }

  set userData(value: IUser) {
    this._userData = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

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
