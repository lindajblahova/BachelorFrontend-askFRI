import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IQuestion} from '../interfaces/IQuestion';
import {IOptionalAnswer} from '../interfaces/IOptionalAnswer';
import {IResponse} from '../interfaces/IResponse';

/** Service pre manipulaciu s Question
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  /** Metoda pre vytvorenie otazky
   * @param question
   * @return Observable<IQuestion> vytvorena otazka
   */
  saveQuestion(question: IQuestion): Observable<IQuestion> {
    return this.http.post<IQuestion>('http://localhost:8080/api/questions/add', question).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre vymazanie otazky pomocou id
   * @param questionId
   * @return Observable<IResponse> response
   */
  deleteQuestion(questionId): Observable<IResponse> {
    return this.http.delete('http://localhost:8080/api/questions/delete/' + questionId).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre pridanie moznosti k vytvorenej otazke
   * @param optionalAnswers pole
   * @return Observable<IResponse> response
   */
  saveOptionalAnswer(optionalAnswers: IOptionalAnswer[]): Observable<IResponse> {
    return this.http.post<IOptionalAnswer>('http://localhost:8080/api/questions/options/add',
      optionalAnswers).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre ziskanie moznosti k otazke pomocou jej id
   * @param idQuestion
   * @return Observable<IOptionalAnswer[]> pole moznosti k otazke
   */
  getOptionalAnswers(idQuestion: number): Observable<IOptionalAnswer[]> {
    return this.http.get<number>('http://localhost:8080/api/questions/options/get/' + idQuestion).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre ziskanie vsetkych otazok miestnosti pomocou jej id
   * @param id
   * @return Observable<IQuestion[]> pole otazok miestnosti
   */
  getRoomQuestions(id: number): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>('http://localhost:8080/api/questions/room/' + id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre ziskanie aktivnych otazok miestnosti pomocou jej id
   * @param id
   * @return Observable<IQuestion[]> pole aktivnych otazok miestnosti
   */
  getRoomActiveQuestions(id: number): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>('http://localhost:8080/api/questions/room/active/' + id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre update zobrazenia otazky ucastnikom
   * @param id
   * @return Observable<IResponse> response
   */
  displayQuestion(id: number): Observable<IResponse> {
    return this.http.put<number>('http://localhost:8080/api/questions/update/question', id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre update zobrazenia vysledkov otazky ucastnikom
   * @param id
   * @return Observable<IResponse> response
   */
  displayAnswers(id: number): Observable<IResponse> {
    return this.http.put<number>('http://localhost:8080/api/questions/update/answers', id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre zachytenie erroru
   * @param error
   * @return Observable<any> Vracia status kod z response
   */
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
