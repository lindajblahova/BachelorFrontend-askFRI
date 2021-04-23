import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IMessage} from '../interfaces/IMessage';
import {IResponse} from '../interfaces/IResponse';
import {IMessageWithLike} from '../interfaces/IMessageWithLike';

/** Service pre manipulaciu s Message
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private _refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) { }

  /** getter pre refresh komponentu
   * zdroj: https://www.youtube.com/watch?v=DvnzeCfYg0s&t=42s
   * @return Subject<void>
   */
  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  /** Metoda pre vytvorenie spravy
   * @param message
   * @return Observable<IResponse> response
   */
  saveMessage(message: IMessage): Observable<IResponse> {
    return this.http.post<IMessage>('http://localhost:8080/api/messages/add', message).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre vymazanie spravy pomocou id
   * @param messageId
   * @return Observable<IResponse> response
   */
  deleteMessage(messageId): Observable<IResponse> {
    return this.http.delete('http://localhost:8080/api/messages/delete/' + messageId).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre ziskanie vsetkych sprav miestnosti pomocou jej id
   * @param id
   * @return Observable<IMessageWithLike[]> pole sprav miestnosti s reakciami
   */
  getRoomMessages(id: number): Observable<IMessageWithLike[]> {
    return this.http.get<IMessageWithLike[]>('http://localhost:8080/api/messages/room/' + id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre zachytenie erroru
   * @param error
   * @return Observable<any> Vracia status kod z response
   */
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
