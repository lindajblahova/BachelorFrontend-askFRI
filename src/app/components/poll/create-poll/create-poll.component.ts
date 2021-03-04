import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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

  private _selectedType: number;
  private _max = 100;
  private _min = 0;
  private _step = 1;
  private _optionalAnswers: OptionalAnswer[] = [];
  readonly separatorKeysCodes: number[] = [ENTER];

  /// INPUT
  private _room: IRoom;

  private _createQuestionForm: FormGroup = this.formBuilder.group({
    questionType: ['', [Validators.required]],
    content: ['', [Validators.required]]
  });

  private _sliderForm: FormGroup = this.formBuilder.group({
    min: [this.min, [Validators.required]],
    max: [this.max, [Validators.required]],
    step: [this.step, [Validators.required]],
  });

  constructor( private questionService: QuestionService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.selectedType = -1;
  }

  createQuestion(): void {
    if (this.room !== undefined) {
      this.questionService.saveQuestion({idQuestion: 0, idRoom: this.room.idRoom,
        type: this.createQuestionForm.get('questionType').value, content: this.createQuestionForm.get('content').value.trim(),
        optionalAnswers: this.optionalAnswers, displayedQuestion: false, displayedAnswers: false}).subscribe(
        response => {
          console.log(response);
        });

      console.log(this.createQuestionForm.get('questionType').value, this.createQuestionForm.get('content').value);
      this.createQuestionForm.reset();
      this.router.navigate(['/rooms', this.room.idRoom]);
    }
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

  getSliderFormStepValidation(): number {
    return (Number(this.sliderForm.get('max').value) - Number(this.sliderForm.get('min').value)) %
      Number(this.sliderForm.get('step').value);
  }

  get optionalAnswers(): OptionalAnswer[] {
    return this._optionalAnswers;
  }

  set optionalAnswers(value: OptionalAnswer[]) {
    this._optionalAnswers = value;
  }
  get sliderForm(): FormGroup {
    return this._sliderForm;
  }

  set sliderForm(value: FormGroup) {
    this._sliderForm = value;
  }
  get createQuestionForm(): FormGroup {
    return this._createQuestionForm;
  }

  set createQuestionForm(value: FormGroup) {
    this._createQuestionForm = value;
  }
  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }
  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }
  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }
  get selectedType(): number {
    return this._selectedType;
  }

  set selectedType(value: number) {
    this._selectedType = value;
  }
  get room(): IRoom {
    return this._room;
  }

  @Input()
  set room(value: IRoom) {
    this._room = value;
  }
}
