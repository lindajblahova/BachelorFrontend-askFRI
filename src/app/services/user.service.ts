import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {IUser} from '../interfaces/IUser';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IRoom} from '../interfaces/IRoom';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = '/assets/data/users.json';
  constructor(private http: HttpClient) { }

  saveUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.url, user).pipe(catchError(this.errorHandler));
  }

  deleteRoom(userId): Observable<HttpEvent<IRoom>> {
    return this.http.delete(this.url, userId).pipe(catchError(this.errorHandler));
  }


  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.url).pipe(catchError(this.errorHandler));
  }

  findUser(email: string): Observable<IUser>{
    console.warn(email);
    return this.getUsers().pipe(
      map(findU => findU.find(user => user.email === email))
    );
  }

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
