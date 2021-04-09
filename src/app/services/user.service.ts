import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {IUser} from '../interfaces/IUser';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IAnsweredQuestion} from '../interfaces/IAnsweredQuestion';
import {ILogin} from '../interfaces/ILogin';
import {ILoginResponse} from '../interfaces/ILoginResponse';
import {IUserPassword} from '../interfaces/IUserPassword';


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
    return this.http.delete('http://localhost:8080/api/users/delete/' + userId).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  updateUser(user: IUserPassword): Observable<IUserPassword> {
    return this.http.put<IUserPassword>('http://localhost:8080/api/users/update', user).pipe(catchError(this.errorHandler));
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

  answerQuestion(answeredQuestion: IAnsweredQuestion): Observable<IAnsweredQuestion> {
    return this.http.post<IAnsweredQuestion>('http://localhost:8080/api/users/user/answered/add',
      answeredQuestion).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  getAnsweredQuestions(id: number): Observable<IAnsweredQuestion[]> {
    return this.http.get<number>('http://localhost:8080/api/users/user/answered/all/' + id).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
