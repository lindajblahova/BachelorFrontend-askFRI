import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap } from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {IQuestion} from '../../../interfaces/IQuestion';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteQuestionComponent} from '../../dialog/dialog-delete-question/dialog-delete-question.component';
import {TokenService} from '../../../services/token.service';
import {IOptionalAnswer} from '../../../interfaces/IOptionalAnswer';
import {UserService} from '../../../services/user.service';
import {dateInputsHaveChanged} from '@angular/material/datepicker/datepicker-input-base';
import {IRoom} from '../../../interfaces/IRoom';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  private _errorMsg: string;
  private _roomId: number;
  private _userId: number;
  private _questions: IQuestion[] = [];
  private _answeredQuestions = [];


  /// INPUTS
  private _author: boolean;

  constructor(private route: ActivatedRoute, private questionService: QuestionService, private dialog: MatDialog,
              private  tokenService: TokenService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.roomId = Number(this.tokenService.getRoomId());
    this._userId = Number(this.tokenService.getUserId());

    this.questionService.refreshNeeded.subscribe(() => {
      this.getRoomQuestions();
    });
    this.getRoomQuestions();

    this.userService.refreshNeeded.subscribe(() => {
      this.getAnsweredQuestions();
    });
    this.getAnsweredQuestions();

  }

  getRoomQuestions(): void {
    this.questionService.getRoomQuestions(this.roomId).subscribe(data => {
      this.questions = data;
    }, error => this.errorMsg = error);
  }

  getAnsweredQuestions(): void {
    this._answeredQuestions = [];
    this.userService.getAnsweredQuestions(this._userId).subscribe(data => {
      data.forEach(item => this.answeredQuestions.push(item.idQuestion));
    }, error => this.errorMsg = error);
  }

  displayQuestionPublic(id: number): void {
    this.questionService.displayQuestion(id).subscribe(data => {}, error => this.errorMsg = error);
  }

  displayAnswersPublic(id: number): void {
    this.questionService.displayAnswers(id).subscribe(data => {}, error => this.errorMsg = error);
  }

  questionAnswered(id: number): void {
    this.userService.answerQuestion({idUser: this._userId, idQuestion: id}).subscribe(data => {},
        error => this.errorMsg = error);
  }

  openDeleteDialog(idQuestion: number): void {
    const dialogRef = this.dialog.open(DialogDeleteQuestionComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.questionService.deleteQuestion(idQuestion).subscribe(data => {}, error => this.errorMsg = error);
      }
    }, error => this.errorMsg = error);
  }

  /// GETTERS AND SETTERS
  get author(): boolean {
    return this._author;
  }

  @Input()
  set author(value: boolean) {
    this._author = value;
  }

  get answeredQuestions(): any[] {
    return this._answeredQuestions;
  }

  set answeredQuestions(value: any[]) {
    this._answeredQuestions = value;
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

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get errorMsg(): string {
    return this._errorMsg;
  }

  set errorMsg(value: string) {
    this._errorMsg = value;
  }

}
