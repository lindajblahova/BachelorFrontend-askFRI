import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IMessage} from '../interfaces/IMessage';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IQuestion} from '../interfaces/IQuestion';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private url = '/assets/data/questions.json';
  constructor(private http: HttpClient) { }

  addQuestion(question: IQuestion): Observable<IQuestion> {
    return this.http.post<IQuestion>(this.url, question).pipe(catchError(this.errorHandler));
  }

  deleteQuestion(questionId): Observable<HttpEvent<IQuestion>> {
    return this.http.delete(this.url, questionId).pipe(catchError(this.errorHandler));
  }

  getQuestions(): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>(this.url).pipe(catchError(this.errorHandler));
  }

  getRoomQuestions(id: number): Observable<IQuestion[]> {
    return this.getQuestions().pipe(
      map(findQ => findQ.filter(question => question.idRoom === id))
    );
  }

  displayQuestion(id: number): void {
    this.getQuestions().pipe(
      map(findQ => findQ.find(question => question.idQuestion === id).displayedQuestion = true)
    );
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
