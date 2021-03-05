import { Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap } from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {IQuestion} from '../../../interfaces/IQuestion';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteQuestionComponent} from '../../dialog/dialog-delete-question/dialog-delete-question.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  private _roomId: number;
  private _questions: IQuestion[] = [];
  private _displayedAnswersPublic = [];

  /// INPUTS
  private _author: boolean;

  constructor( private route: ActivatedRoute, private questionService: QuestionService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
    });

    this.questionService.getRoomQuestions(this.roomId).subscribe(data => this.questions = data);

    this.displayedAnswersPublic.fill(false);
  }

  displayQuestionPublic(id: number): void {
    this.questionService.displayQuestion(id);
  }

  displayAnswersPublic(id: number): void {
    this.displayedAnswersPublic[id] = !this.displayedAnswersPublic[id];
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteQuestionComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
