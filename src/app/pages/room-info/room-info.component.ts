import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

/** Component pre zobrazenie udajov o miestnosti (kod, meno) ucastnikom
 *  pouziva ActivatedRoute pre ziskanie nazvu a pristupoveho kodu miestnosti
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.css']
})
export class RoomInfoComponent implements OnInit {

  private _roomName;
  private _roomPasscode;
  constructor(private activatedRoute: ActivatedRoute) { }

  /** Z aktualnej cesty sa vytiahne nazov a kod miesntosti, ktory sa zobrazi v html
   */
  ngOnInit(): void {
    this._roomName = this.activatedRoute.snapshot.paramMap.get('roomName');
    this._roomPasscode = this.activatedRoute.snapshot.paramMap.get('roomPasscode');
  }

  // GETTRE A SETTRE
  get roomPasscode() {
    return this._roomPasscode;
  }

  set roomPasscode(value) {
    this._roomPasscode = value;
  }
  get roomName() {
    return this._roomName;
  }

  set roomName(value) {
    this._roomName = value;
  }

}
