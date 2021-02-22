import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IQuestion} from '../interfaces/IQuestion';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IAnswer} from '../interfaces/IAnswer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private url = '/assets/data/answers.json';
  constructor(private http: HttpClient) { }

  addAnswer(roomName, roomPasscode): void {}

  getAnswers(): Observable<IAnswer[]> {
    return this.http.get<IAnswer[]>(this.url).pipe(catchError(this.errorHandler));
  }

  getQuestionAnswers(id: number): Observable<IAnswer[]> {
    return this.getAnswers().pipe(
      map(findA => findA.filter(answer => answer.idQuestion === id))
    );
  }

  deleteAnswer(answerId): void {
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
