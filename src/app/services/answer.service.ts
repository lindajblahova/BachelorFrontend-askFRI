import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IAnswer} from '../interfaces/IAnswer';
import {IResponse} from '../interfaces/IResponse';

/** Service pre manipulaciu s Answer
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private _refreshNeeded = new Subject<void>();
  constructor(private http: HttpClient) { }

  /** getter pre refresh komponentu
   * zdroj: https://www.youtube.com/watch?v=DvnzeCfYg0s&t=42s
   * @return Subject<void>
   */
  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  /** Metoda pre vytvorenie odpovede a zaznamu o odpovedi pouzivatela
   * @param answer pole odpovedi ku danej otazke
   * @param id id pouzivatela
   * @return Observable<IResponse> response
   */
  saveAnswer(answer: IAnswer[], id: number): Observable<IResponse> {
    return this.http.post<IAnswer[]>('http://localhost:8080/api/answers/add/' + id, answer).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre ziskanie vsetkych odpovedi k otazke pomocou jej id
   * @param id
   * @return Observable<IAnswer[]> pole odpovedi k otazke
   */
  getQuestionAnswers(id: number): Observable<IAnswer[]> {
    return this.http.get<IAnswer[]>('http://localhost:8080/api/answers/question/' + id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre zachytenie erroru
   * @param error
   * @return Observable<any> Vracia status kod z response
   */
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
