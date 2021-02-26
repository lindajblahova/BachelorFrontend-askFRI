import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IRoom} from '../../../interfaces/IRoom';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {AnswerQuestionComponent} from './answer-question/answer-question.component';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  @Input() author: boolean;
  roomId;
  questions = [];
  question ;
  displayedAnswersPublic = [];
  displayedAnswers = [];

  constructor( private route: ActivatedRoute, private questionService: QuestionService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
    });

    this.questionService.getRoomQuestions(this.roomId).subscribe(data => this.questions = data);

    this.displayedAnswers.fill(false);
    this.displayedAnswersPublic.fill(false);
  }

  showAnswers(id: number): void {
    this.displayedAnswers[id] = !this.displayedAnswers[id];
  }

  displayQuestionPublic(id: number): void {
    this.questionService.displayQuestion(id);
  }

  displayAnswersPublic(id: number): void {
    this.displayedAnswersPublic[id] = !this.displayedAnswersPublic[id];
  }

}
