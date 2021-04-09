import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IMessage} from '../interfaces/IMessage';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private _refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  saveMessage(message: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>('http://localhost:8080/api/messages/add', message).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  deleteMessage(messageId): Observable<HttpEvent<IMessage>> {
    return this.http.delete('http://localhost:8080/api/messages/delete/' + messageId).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  getRoomMessages(id: number): Observable<IMessage[]> {
    return this.http.get<IMessage[]>('http://localhost:8080/api/messages/room/' + id).pipe(catchError(this.errorHandler));
  }

  getMessageLikesCount(id: number): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/messages/message/likes/' + id).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
