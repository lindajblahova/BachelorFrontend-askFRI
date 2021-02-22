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

  @Input() room: IRoom;
  displayed = 'questionList';
  questionId: number;

  constructor() {
  }

  ngOnInit(): void {
    // this.questions = this.questionService.getQuestions();
  }

  newQuestion(): void {
    this.displayed = 'question';
  }

  showQuestions(): void {
    this.displayed = 'questionList';
  }


}
