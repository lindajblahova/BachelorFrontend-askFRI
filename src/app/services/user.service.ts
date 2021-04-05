import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {IUser} from '../interfaces/IUser';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  saveUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('http://localhost:8080/api/register', user).pipe(catchError(this.errorHandler));
  }

  deleteUser(userId): Observable<HttpEvent<IUser>> {
    return this.http.delete('http://localhost:8080/api/users/delete', userId).pipe(catchError(this.errorHandler));
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>('http://localhost:8080/api/users/update', user).pipe(catchError(this.errorHandler));
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('http://localhost:8080/api/users/all').pipe(catchError(this.errorHandler));
  }

  findUser(email: string): Observable<IUser> {
    return this.http.post<string>('http://localhost:8080/api/users/user', email).pipe(catchError(this.errorHandler));
  }

  /*findUser(email: string): Observable<IUser>{
    console.warn(email);
    return this.getUsers().pipe(
      map(findU => findU.find(user => user.email === email))
    );
  }*/

  getUserById(id: number): Observable<IUser>{
    console.log(id);
    return this.getUsers().pipe(
      map(findU => findU.find(user => user.idUser === id))
    );
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
