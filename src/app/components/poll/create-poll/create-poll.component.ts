import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {RoomService} from '../../../services/room.service';
import {QuestionService} from '../../../services/question.service';
import {IRoom} from '../../../interfaces/IRoom';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  @Input() room: IRoom;
  createQuestionForm = this.formBuilder.group({
    questionType: '',
    content: ''
  });

  constructor( private questionService: QuestionService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // this.questionService.addQuestion(1, this.createQuestionForm.get('questionType').value,
    // this.createQuestionForm.get('content').value);
    console.log(this.createQuestionForm.get('questionType').value, this.createQuestionForm.get('content').value);
    this.createQuestionForm.reset();
    this.router.navigate(['/rooms', this.room.idRoom]);
  }

  selected(): void{}

}
