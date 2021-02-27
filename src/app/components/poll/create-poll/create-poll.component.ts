import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {RoomService} from '../../../services/room.service';
import {QuestionService} from '../../../services/question.service';
import {IRoom} from '../../../interfaces/IRoom';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

export interface OptionalAnswer {
  name: string;
}

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  @Input() room: IRoom;
  selectedType = -1;

  max = 100;
  min = 0;
  step = 1;
  value = 0;

  createQuestionForm = this.formBuilder.group({
    questionType: '',
    content: ''
  });

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  optionalAnswers: OptionalAnswer[] = [
  ];


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
  select(type: number): void{
    this.selectedType = type;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.optionalAnswers.push({name: value.trim()});
    }

    if (input) {
      input.value = '';
    }
  }

  remove(fruit: OptionalAnswer): void {
    const index = this.optionalAnswers.indexOf(fruit);

    if (index >= 0) {
      this.optionalAnswers.splice(index, 1);
    }
  }

}
