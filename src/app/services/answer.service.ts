import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IAnswer} from '../interfaces/IAnswer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private _refreshNeeded = new Subject<void>();
  constructor(private http: HttpClient) { }

  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  saveAnswer(answer: IAnswer): Observable<IAnswer> {
    return this.http.post<IAnswer>('http://localhost:8080/api/answers/add', answer).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  getQuestionAnswers(id: number): Observable<IAnswer[]> {
    return this.http.get<IAnswer[]>('http://localhost:8080/api/answers/question/' + id).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
