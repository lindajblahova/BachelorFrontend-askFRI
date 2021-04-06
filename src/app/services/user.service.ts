import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {IUser} from '../interfaces/IUser';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {ILikedMessage} from '../interfaces/ILikedMessage';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  saveUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('http://localhost:8080/api/register', user).pipe(catchError(this.errorHandler));
  }

  deleteUser(userId): Observable<HttpEvent<IUser>> {
    return this.http.delete('http://localhost:8080/api/users/delete/' + userId).pipe(catchError(this.errorHandler));
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>('http://localhost:8080/api/users/update', user).pipe(catchError(this.errorHandler));
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('http://localhost:8080/api/users/all').pipe(catchError(this.errorHandler));
  }

  findUser(email: string): Observable<IUser> {
    return this.http.get<string>('http://localhost:8080/api/users/useremail/' + email).pipe(catchError(this.errorHandler));
  }

  getUserById(id: number): Observable<IUser>{
    return this.http.get<IUser>('http://localhost:8080/api/users/user/' + id).pipe(catchError(this.errorHandler));
  }

  likeMessage(likedMessage: ILikedMessage): Observable<ILikedMessage> {
    return this.http.post<ILikedMessage>('http://localhost:8080/api/users/user/message/like',
      likedMessage).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  unlikeMessage(id: number): Observable<ILikedMessage> {
    return this.http.delete('http://localhost:8080/api/users/user/message/unlike/'
      + id).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  getLikedMessages(id: number): Observable<ILikedMessage[]> {
    return this.http.get<number>('http://localhost:8080/api/users/user/messages/liked/' + id).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
