import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IRoom} from '../../../interfaces/IRoom';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {IQuestion} from '../../../interfaces/IQuestion';
import {element} from 'protractor';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  @Input() author: boolean;
  roomId;
  questions = [];
  question ;
  questionClicked: IQuestion;
  displayedAnswersPublic = [];
  displayedAnswers = [];
  constructor( private route: ActivatedRoute, private questionService: QuestionService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
    });

    this.questionService.getRoomQuestions(this.roomId).subscribe(data => this.questions = data);

    this.displayedAnswers.fill(false);
    this.displayedAnswersPublic.fill(false);
  }

  showAnswers(id: number): void {
    this.displayedAnswers[id] = !this.displayedAnswers[id];
  }

  onClick(question: IQuestion): void {
    this.questionClicked = question;
  }

  displayQuestionPublic(id: number): void {
    this.questionService.displayQuestion(id);
  }

  displayAnswersPublic(id: number): void {
    this.displayedAnswersPublic[id] = !this.displayedAnswersPublic[id];
  }

}
