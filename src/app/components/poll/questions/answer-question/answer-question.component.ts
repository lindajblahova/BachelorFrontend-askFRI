import {Component, Input, OnInit} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css']
})
export class AnswerQuestionComponent implements OnInit {

  @Input() question;
  @Input() author;
  @Input() color: string;
  answers = [];
  myForm = this.formBuilder.group({
    content:  ['']
  });
  constructor(private answerService: AnswerService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.answerService.getQuestionAnswers(this.question.idQuestion).subscribe(data => this.answers = data);
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

  onSubmit(): void {
    console.log(this.myForm.get('content').value);
  }

}
