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

  private url = '/assets/data/users.json';
  private url2 = 'https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=text';
  constructor(private http: HttpClient) { }

  getIPAddress(): Observable<any> {
    return this.http.get(this.url2);
  }

  saveUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.url, user).pipe(catchError(this.errorHandler));
  }

  deleteUser(userId): Observable<HttpEvent<IUser>> {
    return this.http.delete(this.url, userId).pipe(catchError(this.errorHandler));
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.url, user).pipe(catchError(this.errorHandler));
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
