import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
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

  addAnswer(answer: IAnswer): Observable<IAnswer> {
    return this.http.post<IAnswer>(this.url, answer).pipe(catchError(this.errorHandler));
  }

  deleteAnswer(answerId): Observable<HttpEvent<IAnswer>> {
    return this.http.delete(this.url, answerId).pipe(catchError(this.errorHandler));
  }

  getAnswers(): Observable<IAnswer[]> {
    return this.http.get<IAnswer[]>(this.url).pipe(catchError(this.errorHandler));
  }

  getQuestionAnswers(id: number): Observable<IAnswer[]> {
    return this.getAnswers().pipe(
      map(findA => findA.filter(answer => answer.idQuestion === id))
    );
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
