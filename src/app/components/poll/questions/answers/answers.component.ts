import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {IAnswer} from '../../../../interfaces/IAnswer';
import {IOptionalAnswer} from '../../../../interfaces/IOptionalAnswer';
import {QuestionService} from '../../../../services/question.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit, OnDestroy {

  private _errorMsg: string;
  private _answers: IAnswer[] = [];
  private _optionalAnswers: IOptionalAnswer[] = [];
  private _answersCount: number;
  private _sliderA;
  private _sliderNumbers;

  /// INPUTS
  private _question;
  private _author;
  private _color: string;
  private interval;

  constructor(private questionService: QuestionService, private answerService: AnswerService) {
  }

  ngOnInit(): void {
    this.answerService.refreshNeeded.subscribe( () => {
      this.getQuestionAnswers();
    });
    this.getQuestionAnswers();
    this.getOptionalAnswers();

    this.interval = setInterval(() => {this.getQuestionAnswers(); }, 5000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getQuestionAnswers(): void {
    this.answerService.getQuestionAnswers(this.question.idQuestion).subscribe(data => this.answers = data,
        error => this.errorMsg = error);
    console.log(this.answers);
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
        this.sliderAnswers();
      }
    }, error => this.errorMsg = error );
  }

  showCount(answerPar: string): void {
      this.answersCount = 0;
      this.answers.filter(element => {
        if (element.content === answerPar) {
          this.answersCount += 1;
        }
      });
  }

  showCountSlider(answerPar: number): void {
    this.answersCount = 0;
    this.answers.filter(element => {
      if (element.content === '' + answerPar) {
        this.answersCount += 1;
      }
    });
  }

  sliderAnswers(): void {
     this.sliderA = (Number(this._optionalAnswers[2].content) - Number(this._optionalAnswers[0].content)) /
       Number(this._optionalAnswers[1].content);
     console.log(this.sliderA);
     this.sliderNumbers = Array();
     for (let i = 0; i <= this.sliderA; i++) {
       this.sliderNumbers.push(i * Number(this._optionalAnswers[1].content));
    }
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

  /// GETTERS AND SETTERS
  get optionalAnswers(): IOptionalAnswer[] {
    return this._optionalAnswers;
  }

  set optionalAnswers(value: IOptionalAnswer[]) {
    this._optionalAnswers = value;
  }

  get errorMsg(): string {
    return this._errorMsg;
  }

  set errorMsg(value: string) {
    this._errorMsg = value;
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
  get sliderNumbers() {
    return this._sliderNumbers;
  }

  set sliderNumbers(value) {
    this._sliderNumbers = value;
  }
  get sliderA() {
    return this._sliderA;
  }

  set sliderA(value) {
    this._sliderA = value;
  }
  get answersCount(): number {
    return this._answersCount;
  }

  set answersCount(value: number) {
    this._answersCount = value;
  }
  get answers(): any[] {
    return this._answers;
  }

  set answers(value: any[]) {
    this._answers = value;
  }

}
