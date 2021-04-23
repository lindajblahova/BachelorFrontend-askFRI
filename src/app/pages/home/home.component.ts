import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

/** Component pre domovsku stranku vyucujuceho - obsahuje podkomponenty - create room a rooms (zoznam miestnosti)
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private _isLoggedIn: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
  }

  /// GETTERS AND SETTERS
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

}
