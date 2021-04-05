import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../services/room.service';
import {Router} from '@angular/router';
import {passscodeAlreadyExist} from '../../validators/regex-validation';
import {IRoom} from '../../interfaces/IRoom';
import {IUser} from '../../interfaces/IUser';
import {TokenService} from '../../services/token.service';

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
  constructor(private router: Router, private roomService: RoomService, private formBuilder: FormBuilder,
              private tokenService: TokenService) { }

  ngOnInit(): void {
  }

  showFormChange(): void {
    this.showForm = !this.showForm;
  }

  createRoom(): void {
      console.log( Number(this.tokenService.getUserId()));
      this.roomService.saveRoom({idRoom: 0, idOwner: Number(this.tokenService.getUserId()),
      roomName: this.createRoomForm.get('roomName').value,
      roomPasscode: this.createRoomForm.get('roomPasscode').value, active: true}).subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/home']);
          this.createRoomForm.reset();
          this.showFormChange();
          this.reloadComponent();
        });
  }

  reloadComponent(): void {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
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
