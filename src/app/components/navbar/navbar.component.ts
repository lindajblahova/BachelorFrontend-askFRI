import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IRoom} from '../../interfaces/IRoom';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private _isOpened: boolean = false;
  /// INPUTS
  private _participant: number;  // 0 = register + login, 1 = participant room, 2 = log out
  private _room?: IRoom;
  private _userId?: number;
  private _activeTab?: string;

  constructor(private router: Router, private tokenService: TokenService) { }

  ngOnInit(): void {
  }

  goLogIn(): void {
    this.router.navigate(['/login']);
  }

  goInit(): void {
    this.router.navigate(['/']);
  }

  goRegister(): void {
    this.router.navigate(['/register']);
  }

  goLogOut(): void {
    this.tokenService.signOut();
    this.router.navigate(['/login']);
  }

  goParticipant(): void {
    this.router.navigate(['/enter-room', this._userId]);
  }

  goHome(): void {
    if (this._room != null) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  goProfile(): void {
    this.router.navigate(['/profile', this._userId]);
  }

  get isOpened(): boolean {
    return this._isOpened;
  }

  set isOpened(value: boolean) {
    this._isOpened = value;
  }

  get activeTab() {
    return this._activeTab;
  }

  @Input()
  set activeTab(value) {
    this._activeTab = value;
  }
  get userId() {
    return this._userId;
  }

  @Input()
  set userId(value) {
    this._userId = value;
  }
  get room() {
    return this._room;
  }

  @Input()
  set room(value) {
    this._room = value;
  }
  get participant() {
    return this._participant;
  }

  @Input()
  set participant(value) {
    this._participant = value;
  }

}
