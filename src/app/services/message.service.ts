import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IMessage} from '../interfaces/IMessage';
import {IRoom} from '../interfaces/IRoom';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private url = '/assets/data/messages.json';
  constructor(private http: HttpClient) { }

  addMessage(roomName, roomPasscode): void {}

  getMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.url).pipe(catchError(this.errorHandler));
  }

  getRoomMessages(id: number): Observable<IMessage[]> {
    return this.getMessages().pipe(
      map(findM => findM.filter(message => message.idRoom === id))
    );
  }

  deleteMessage(roomId): void {
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
