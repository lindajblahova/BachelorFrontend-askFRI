import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

/** Component pre domovsku stranku administratora, obsahuje 2 podkomponenty - all rooms a all users
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  private _isAdmin: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this._isAdmin = this.authService.isUserAdmin();
  }

  // GETTRE A SETTRE
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }
}
