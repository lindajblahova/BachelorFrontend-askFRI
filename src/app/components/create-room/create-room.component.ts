import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../services/room.service';
import {Router} from '@angular/router';
import {IRoom} from '../../interfaces/IRoom';
import {IUser} from '../../interfaces/IUser';
import {TokenService} from '../../services/token.service';
import {debounce} from 'lodash-es';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  private _passcodeMessage: string;
  private successMsg: string;
  private _errorMsg: string;
  private _showForm: boolean = false;

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
          this.successMsg = 'Miestnosť ' + response.roomName + ' bola vytvorená';
          // this.router.navigate(['/home']);
          this.createRoomForm.reset();
          this.showFormChange();
          this.reloadComponent();
        }, error => {
          if (error === 406)
          {
            this._errorMsg = 'Tento kód aktuálne nie je dostupný!';
          }
        });
  }

  isPasscodeTaken = debounce((passcode: string): void =>
  {
    if (passcode !== '')
    {
      this.roomService.isPasscodeCurrentlyUsed(passcode).subscribe(response => {
        if (response === true)
        {
          this._passcodeMessage = 'Tento kód aktuálne nie je možné použiť';
        }
        else
        {
          this._passcodeMessage = 'Tento kód je voľný';
        }
      }, error => this.errorMsg = error);
    }
  }, 500);

  reloadComponent(): void {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  /// GETTERS AND SETTERS
  get errorMsg(): string {
    return this._errorMsg;
  }

  set errorMsg(value: string) {
    this._errorMsg = value;
  }

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

  get passcodeMessage(): string {
    return this._passcodeMessage;
  }

  set passcodeMessage(value: string) {
    this._passcodeMessage = value;
  }
}
