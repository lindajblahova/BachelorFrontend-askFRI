import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {IAnswer} from '../../../../interfaces/IAnswer';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  @Input() question;
  @Input() author;
  @Input() color: string;
  answers = [];
  answersCount: number;
  sliderA;
  sliderNumbers;

  constructor(private answerService: AnswerService) {
  }

  ngOnInit(): void {
    this.answerService.getQuestionAnswers(this.question.idQuestion).subscribe(data => this.answers = data);
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

  sliderAnswers(): number[]{
     this.sliderA = (this.question.optionalAnswers[1] - this.question.optionalAnswers[0]) / this.question.optionalAnswers[2];
     this.sliderNumbers = Array();
     for (let i = 0; i <= this.sliderA; i++) {
       this.sliderNumbers.push(i * this.question.optionalAnswers[2]);
    }
     return this.sliderNumbers;
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

}
