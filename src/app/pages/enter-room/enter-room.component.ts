import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {IRoom} from '../../interfaces/IRoom';
import {IUser} from '../../interfaces/IUser';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.css']
})
export class EnterRoomComponent implements OnInit {

  private _room: IRoom;
  private _passcode: string;
  private _errorMsg: string;
  private _passcodeForm: FormGroup = this.formBuilder.group({
    passcode: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private roomService: RoomService,  private router: Router,
              private route: ActivatedRoute, private userService: UserService, private tokenService: TokenService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.passcodeForm.get('passcode').value !== '') {
      this.passcode = this.passcodeForm.get('passcode').value;
      this.roomService.getActiveRoomByPasscode(this.passcode).subscribe(data => {
        this.room = data;
        if (this.room !== null) {
          this.tokenService.saveRoomId('' + this.room.idRoom);
          this.tokenService.saveSection('' + 0);
          this.tokenService.saveRoomAuthor('false');
          this.router.navigate(['/room']);
        }
      }, error => {
      if (error === 400) {
        this.errorMsg = 'Zadaný kód neexistuje!';
      } });
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

  get room() {
    return this._room;
  }

  set room(value) {
    this._room = value;
  }

}
