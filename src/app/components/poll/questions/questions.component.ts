import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IRoom} from '../../../interfaces/IRoom';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {IQuestion} from '../../../interfaces/IQuestion';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  @Input() room: IRoom;
  roomId;
  questions = [];
  questionClicked: IQuestion;
  displayedAnswers = [];
  constructor( private route: ActivatedRoute, private questionService: QuestionService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
    });

    this.questionService.getRoomQuestions(this.roomId).subscribe(data => this.questions = data);

    this.displayedAnswers.fill(false);
  }

  showAnswers(id: number): void {
    this.displayedAnswers[id] = !this.displayedAnswers[id];
  }

  onClick(question: IQuestion): void {
    this.questionClicked = question;
  }

}
