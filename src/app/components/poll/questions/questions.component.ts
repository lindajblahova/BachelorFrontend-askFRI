import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap } from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {IQuestion} from '../../../interfaces/IQuestion';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteQuestionComponent} from '../../dialog/dialog-delete-question/dialog-delete-question.component';
import {TokenService} from '../../../services/token.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  private _roomId: number;
  private _questions: IQuestion[] = [];
  private _isQuestionAnswered = [];

  /// INPUTS
  private _author: boolean;

  constructor( private route: ActivatedRoute, private questionService: QuestionService, private dialog: MatDialog,
               private  tokenService: TokenService) { }

  ngOnInit(): void {
    this.roomId = Number(this.tokenService.getRoomId());

    this.questionService.refreshNeeded.subscribe( () => {
      this.getRoomQuestions();
    });
    this.getRoomQuestions();

    this.isQuestionAnswered = new Array(this.questions.length).fill(false);
  }

  getRoomQuestions(): void
  {
    this.questionService.getRoomQuestions(this.roomId).subscribe(data => this.questions = data);
  }

  displayQuestionPublic(id: number): void {
    this.questionService.displayQuestion(id).subscribe();
  }

  displayAnswersPublic(id: number): void {
    this.questionService.displayAnswers(id).subscribe();
  }

  questionAnswered(id: number): void {
    this.isQuestionAnswered[id] = !this.isQuestionAnswered[id];
  }

  openDeleteDialog(idQuestion: number): void {
    const dialogRef = this.dialog.open(DialogDeleteQuestionComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.questionService.deleteQuestion(idQuestion).subscribe();
      }
    });
  }

  /// GETTERS AND SETTERS
  get author(): boolean {
    return this._author;
  }

  @Input()
  set author(value: boolean) {
    this._author = value;
  }

  get isQuestionAnswered(): any[] {
    return this._isQuestionAnswered;
  }

  set isQuestionAnswered(value: any[]) {
    this._isQuestionAnswered = value;
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
