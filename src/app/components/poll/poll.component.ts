import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {FormBuilder} from '@angular/forms';
import {QuestionService} from '../../services/question.service';
import {IRoom} from '../../interfaces/IRoom';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {

  private _displayed = 'questionList';

  /// INPUTS
  private _room: IRoom;
  private _author: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  newQuestion(): void {
    this.displayed = 'question';
  }

  showQuestions(): void {
    this.displayed = 'questionList';
  }

  /// GETTERS AND SETTERS
  get author(): boolean {
    return this._author;
  }

  @Input()
  set author(value: boolean) {
    this._author = value;
  }
  get room(): IRoom {
    return this._room;
  }

  @Input()
  set room(value: IRoom) {
    this._room = value;
  }
  get displayed(): string {
    return this._displayed;
  }

  set displayed(value: string) {
    this._displayed = value;
  }

}
