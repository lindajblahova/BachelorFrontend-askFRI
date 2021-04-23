import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IRoom} from '../../interfaces/IRoom';
import {TokenService} from '../../services/token.service';
import {AuthService} from '../../services/auth.service';

/** Component pre navigacne menu (navbar)
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private _isLoggedIn: boolean = false;
  private _isOpened: boolean = false;
  private _role: string;

  /** Vstupy z jednotlivych komponentov, kde je navbar vytvoreny
   * Vstupy oznacene ? su optional
   */
  /// INPUTS
  private _participant: number;
  private _room?: IRoom;
  private _activeTab?: string;

  constructor(private router: Router, private tokenService: TokenService, private authService: AuthService) { }

  ngOnInit(): void {
    this.role = this.tokenService.getAuthorities();
    this.isLoggedIn = this.authService.isUserLoggedIn();
  }

  goLogIn(): void {
    this.router.navigate(['/login']);
  }

  goLogOut(): void {
    this.tokenService.leaveRoom();
    this.tokenService.signOut();
    this.role = null;
    this.router.navigate(['/login']);
  }

  goAdmin(): void {
    this.router.navigate(['/adminHome']);
  }

  goParticipant(): void {
    this.tokenService.leaveRoom();
    this.router.navigate(['/enter-room']);
  }

  goHome(): void {
    this.tokenService.leaveRoom();
    this.router.navigate(['/home']);
  }

  goProfile(): void {
    this.tokenService.leaveRoom();
    this.router.navigate(['/profile']);
  }

  // GETTRE A SETTRE
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
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

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  @Input()
  set activeTab(value) {
    this._activeTab = value;
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
