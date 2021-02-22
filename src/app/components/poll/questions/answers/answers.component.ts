import {Component, Input, OnInit} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {IAnswer} from '../../../../interfaces/IAnswer';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  @Input() question;
  answers = [];
  @Input() displayedAnswers;
  constructor(private answerService: AnswerService) { }

  ngOnInit(): void {
    console.log(this.displayedAnswers[this.question.idQuestion]);
    this.answerService.getQuestionAnswers(this.question.idQuestion).subscribe(data => this.answers = data);
  }

}
