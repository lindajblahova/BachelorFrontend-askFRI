import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IQuestion} from '../../../../interfaces/IQuestion';
import {QuestionService} from '../../../../services/question.service';
import {IOptionalAnswer} from '../../../../interfaces/IOptionalAnswer';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css']
})
export class AnswerQuestionComponent implements OnInit {

  private _errorMsg: string;
  private _optionalAnswers: IOptionalAnswer[] = [];
  private _min: number;
  private _max: number;
  private _step: number;
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

  constructor(private questionService: QuestionService, private answerService: AnswerService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getOptionalAnswers();
    this.checkFormChecked = new Array(this._optionalAnswers.length).fill(false);
  }

  getOptionalAnswers(): void {
    this.questionService.getOptionalAnswers(this.question.idQuestion).subscribe(data => {
      this._optionalAnswers = data;
      this._optionalAnswers.sort((a, b) => {
        if (a.content > b.content) {
          return 1;
        }
        if (a.content < b.content) {
          return -1;
        }
        return 0;
      });
      if (this.question.type === 3)
      {
        this._min = Number(this._optionalAnswers[0].content);
        this._max = Number(this._optionalAnswers[2].content);
        this._step = Number(this._optionalAnswers[1].content);
      }
    }, error => this.errorMsg = error );
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
    if (this.sliderValue !== null) {
      console.log(this.sliderValue);
      this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.sliderValue}).subscribe(
        response => {
        }, error => this.errorMsg = error );
      this.questionWasAnswered.emit();
    }
  }

  createRadioAnswer(): void {
    if (this.radioValue !== null) {
      this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.radioValue}).subscribe(
        response => {
        }, error => this.errorMsg = error );
      this.questionWasAnswered.emit(this.question.idQuestion);
    }
  }

  createCheckboxAnswer(): void {
    if (this.checkFormChecked.length > 0) {
      for (let i = 0; i < this.checkFormChecked.length; i++) {
        if (this.checkFormChecked[i] === true) {
          this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
            content: this._optionalAnswers[i].content}).subscribe(
            response => {
            }, error => this.errorMsg = error );
        }
      }
      this.questionWasAnswered.emit(this.question.idQuestion);
    }
  }

  createCustomAnswer(): void {
    if (this.answerForm.get('content').value.trim() !== '') {
      console.log(this.answerForm.get('content').value);
      this.answerService.saveAnswer({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.answerForm.get('content').value}).subscribe(
        response => {
        }, error => this.errorMsg = error );
      this.questionWasAnswered.emit(this.question.idQuestion);
    }

  }

  /// GETTERS AND SETTERS
  get errorMsg(): string {
    return this._errorMsg;
  }

  set errorMsg(value: string) {
    this._errorMsg = value;
  }

  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }
  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }
  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }
  get optionalAnswers(): IOptionalAnswer[] {
    return this._optionalAnswers;
  }

  set optionalAnswers(value: IOptionalAnswer[]) {
    this._optionalAnswers = value;
  }

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

}
