import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IMessage} from '../interfaces/IMessage';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private url = '/assets/data/messages.json';
  constructor(private http: HttpClient) { }

  saveMessage(message: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>(this.url, message).pipe(catchError(this.errorHandler));
  }

  deleteMessage(messageId): Observable<HttpEvent<IMessage>> {
    return this.http.delete(this.url, messageId).pipe(catchError(this.errorHandler));
  }


  getMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.url).pipe(catchError(this.errorHandler));
  }

  getRoomMessages(id: number): Observable<IMessage[]> {
    return this.getMessages().pipe(
      map(findM => findM.filter(message => message.idRoom === id))
    );
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
