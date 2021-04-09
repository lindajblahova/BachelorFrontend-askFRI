import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IQuestion} from '../interfaces/IQuestion';
import {OptionalAnswer} from '../components/poll/create-poll/create-poll.component';
import {IOptionalAnswer} from '../interfaces/IOptionalAnswer';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private _refreshNeeded = new Subject<void>();
  constructor(private http: HttpClient) { }

  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  saveQuestion(question: IQuestion): Observable<IQuestion> {
    return this.http.post<IQuestion>('http://localhost:8080/api/questions/add', question).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  deleteQuestion(questionId): Observable<HttpEvent<IQuestion>> {
    return this.http.delete('http://localhost:8080/api/questions/delete/' + questionId).pipe(catchError(this.errorHandler))
     .pipe( tap(() => {
       this._refreshNeeded.next();
      }));
  }

  saveOptionalAnswer(optionalAnswer: IOptionalAnswer): Observable<IOptionalAnswer> {
    return this.http.post<IOptionalAnswer>('http://localhost:8080/api/questions/options/add',
      optionalAnswer).pipe(catchError(this.errorHandler));
  }

  getOptionalAnswers(idQuestion: number): Observable<IOptionalAnswer[]> {
    return this.http.get<number>('http://localhost:8080/api/questions/options/get/' + idQuestion).pipe(catchError(this.errorHandler));
  }

  getRoomQuestions(id: number): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>('http://localhost:8080/api/questions/room/' + id).pipe(catchError(this.errorHandler));
  }

  displayQuestion(id: number): Observable<IQuestion> {
    return this.http.put<number>('http://localhost:8080/api/questions/update/question', id).pipe(catchError(this.errorHandler));
  }

  displayAnswers(id: number): Observable<IQuestion> {
    return this.http.put<number>('http://localhost:8080/api/questions/update/answers', id).pipe(catchError(this.errorHandler));
  }


  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
