import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private _userId;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = Number(params.get('userId'));
      console.log(this.userId);
    });
  }

  /// GETTERS AND SETTERS
  get userId() {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
  }

}
