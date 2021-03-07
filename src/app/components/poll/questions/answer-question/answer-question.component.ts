import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IAnswer} from '../../../../interfaces/IAnswer';
import {IQuestion} from '../../../../interfaces/IQuestion';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css']
})
export class AnswerQuestionComponent implements OnInit {

  private _answers: IAnswer[] = [];
  private _sliderValue: string;
  private _radioValue: string;
  private _checkFormChecked: boolean[];

  /// INPUTS
  private _question: IQuestion;
  private _author: boolean;
  private _color: string;

  /// OUTPUT
  private _questionWasAnswered = new EventEmitter<number>();

  private _answerForm: FormGroup = this.formBuilder.group({
    content:  ['']
  });

  constructor(private answerService: AnswerService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.answerService.getQuestionAnswers(this.question.idQuestion).subscribe(data => this.answers = data);
    this.checkFormChecked = new Array(this.answers.length).fill(false);
  }

  getBackgroundColor(id: string): string {
    const idNumber = Number(id);
    let color = '#ffffff';
    switch (idNumber % 5) {
      case 1:
        color = 'rgba(83,179,255,0.3)';
        break;
      case 2:
        color = 'rgba(16, 255, 218, 0.3)';
        break;
      case 3:
        color = 'rgba(255,78,65,0.3)';
        break;
      case 4:
        color = 'rgba(235,112,177,0.3)';
        break;
      default:
        color = 'rgba(112,234,80,0.3)';
    }
    return color;
  }

  createSliderAnswer(): void {
    if (this.sliderValue !== undefined) {
      console.log(this.sliderValue);
      this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.sliderValue}).subscribe(
        response => {
          console.log(response);
        });
      this.questionWasAnswered.emit();
    }
  }

  createRadioAnswer(): void {
    if (this.radioValue !== undefined) {
      console.log(this.radioValue);
      this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.radioValue}).subscribe(
        response => {
          console.log(response);
        });
      this.questionWasAnswered.emit();
    }
  }

  createCheckboxAnswer(): void {
    if (this.checkFormChecked.length > 0) {
      for (let i = 0; i < this.checkFormChecked.length; i++) {
        if (this.checkFormChecked[i] === true) {
          console.log(this.question.optionalAnswers[i]);
        }
      }
      this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.radioValue}).subscribe(
        response => {
          console.log(response);
        });
      this.questionWasAnswered.emit();
    }
  }

  createCustomAnswer(): void {
    if (this.answerForm.get('content').value.trim() !== '') {
      console.log(this.answerForm.get('content').value);
      this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.answerForm.get('content').value}).subscribe(
        response => {
          console.log(response);
        });
      this.questionWasAnswered.emit();
    }

  }

  /// GETTERS AND SETTERS
  @Output()
  get questionWasAnswered(): EventEmitter<number> {
    return this._questionWasAnswered;
  }

  set questionWasAnswered(value: EventEmitter<number>) {
    this._questionWasAnswered = value;
  }

  get answerForm(): FormGroup {
    return this._answerForm;
  }

  set answerForm(value: FormGroup) {
    this._answerForm = value;
  }
  get color(): string {
    return this._color;
  }

  @Input()
  set color(value: string) {
    this._color = value;
  }
  get author() {
    return this._author;
  }

  @Input()
  set author(value) {
    this._author = value;
  }
  get question() {
    return this._question;
  }

  @Input()
  set question(value) {
    this._question = value;
  }
  get checkFormChecked() {
    return this._checkFormChecked;
  }

  set checkFormChecked(value) {
    this._checkFormChecked = value;
  }
  get radioValue() {
    return this._radioValue;
  }

  set radioValue(value) {
    this._radioValue = value;
  }
  get sliderValue(): string {
    return this._sliderValue;
  }

  set sliderValue(value: string) {
    this._sliderValue = value;
  }
  get answers(): any[] {
    return this._answers;
  }

  set answers(value: any[]) {
    this._answers = value;
  }
}
