import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IRoom} from '../../../interfaces/IRoom';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {AnswerQuestionComponent} from './answer-question/answer-question.component';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  private _roomId;
  private _questions = [];
  private _displayedAnswersPublic = [];
  private _displayedAnswers = [];

  /// INPUTS
  private _author: boolean;

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

  displayQuestionPublic(id: number): void {
    this.questionService.displayQuestion(id);
  }

  displayAnswersPublic(id: number): void {
    this.displayedAnswersPublic[id] = !this.displayedAnswersPublic[id];
  }

  /// GETTERS AND SETTERS
  get author(): boolean {
    return this._author;
  }

  @Input()
  set author(value: boolean) {
    this._author = value;
  }
  get displayedAnswers(): any[] {
    return this._displayedAnswers;
  }

  set displayedAnswers(value: any[]) {
    this._displayedAnswers = value;
  }
  get displayedAnswersPublic(): any[] {
    return this._displayedAnswersPublic;
  }

  set displayedAnswersPublic(value: any[]) {
    this._displayedAnswersPublic = value;
  }
  get questions(): any[] {
    return this._questions;
  }

  set questions(value: any[]) {
    this._questions = value;
  }
  get roomId() {
    return this._roomId;
  }

  set roomId(value) {
    this._roomId = value;
  }

}
