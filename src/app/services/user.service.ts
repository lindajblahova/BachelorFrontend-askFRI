import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {IUser} from '../interfaces/IUser';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = '/assets/data/users.json';
  constructor(private http: HttpClient) { }

  addUser(roomName, roomPasscode): void {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.url).pipe(catchError(this.errorHandler));
  }

  findUser(email: string): Observable<IUser>{
    console.warn(email);
    return this.getUsers().pipe(
      map(findU => findU.find(user => user.email === email))
    );
  }

  deleteRoom(roomId): void {
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
