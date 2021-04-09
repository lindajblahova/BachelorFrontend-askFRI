import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private _errorMsg: string;
  private _userId: number;
  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.userId = Number(this.tokenService.getUserId());
    console.log(this.userId);
  }

  /// GETTERS AND SETTERS
  get userId() {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
  }

  get errorMsg(): string {
    return this._errorMsg;
  }

  set errorMsg(value: string) {
    this._errorMsg = value;
  }

}
