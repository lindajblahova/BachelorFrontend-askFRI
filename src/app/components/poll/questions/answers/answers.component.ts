import {Component, Input, OnInit} from '@angular/core';
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
  answers = [];
  answersCount: number;
  @Input() displayedAnswers;

  constructor(private answerService: AnswerService) {
  }

  ngOnInit(): void {
    console.log(this.displayedAnswers[this.question.idQuestion]);
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
}
