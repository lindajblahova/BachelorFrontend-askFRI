import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {IUser} from '../interfaces/IUser';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IAnsweredQuestion} from '../interfaces/IAnsweredQuestion';
import {IUserPassword} from '../interfaces/IUserPassword';
import {IResponse} from '../interfaces/IResponse';
import {ILikedMessage} from '../interfaces/ILikedMessage';
import {IUserProfile} from '../interfaces/IUserProfile';

/** Service pre manipulaciu s Userom
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) { }

  /** getter pre refresh komponentu
   * zdroj: https://www.youtube.com/watch?v=DvnzeCfYg0s&t=42s
   * @return Subject<void>
   */
  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  /** Metoda pre vytvorenie pouzivatela
   * @param user
   * @return Observable<IResponse> response
   */
  saveUser(user: IUser): Observable<IResponse> {
    return this.http.post<IUser>('http://localhost:8080/api/register', user).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre vymazanie pouzivatela pomocou id
   * @param userId
   * @return Observable<IResponse> response
   */
  deleteUser(userId): Observable<IResponse> {
    return this.http.delete('http://localhost:8080/api/users/delete/' + userId).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre update hesla pouzivatela
   * @param user
   * @return Observable<IResponse> response
   */
  updateUser(user: IUserPassword): Observable<IResponse> {
    return this.http.put<IUserPassword>('http://localhost:8080/api/users/update', user).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre ziskanie profilovych dat pouzivatela
   * @param id
   * @return Observable<IUser> udaje pouzivatela
   */
  getUserById(id: number): Observable<IUserProfile>{
    return this.http.get<IUserProfile>('http://localhost:8080/api/users/user/' + id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre ziskanie pouzivatelom zodpovedanych otazok pre danu mmiestnost
   * @param idUser
   * @param idRoom
   * @return Observable<IAnsweredQuestion[]> pole zodpovedanych sprav
   */
  getAnsweredQuestions(idUser: number, idRoom: number ): Observable<IAnsweredQuestion[]> {
    return this.http.get<number>('http://localhost:8080/api/users/user/answered/all/' + idUser + '/'
      + idRoom ).pipe(catchError(this.errorHandler));
  }


  /** Metoda pre odoslanie reakcie na spravu, po vykonani zavola refresh komponentu
   * @param likedMessage
   * @return Observable<IResponse> response
   */
  likeMessage(likedMessage: ILikedMessage): Observable<IResponse> {
    return this.http.post<IResponse>('http://localhost:8080/api/users/user/message/like',
      likedMessage).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre zrusenie reakcie na spravu, po vykonani zavola refresh komponentu
   * @param likedMessage
   * @return Observable<IResponse> response
   */
  unlikeMessage(likedMessage: ILikedMessage): Observable<IResponse> {
    return this.http.delete('http://localhost:8080/api/users/user/message/unlike/' +
                                likedMessage.idMessage + '/' + likedMessage.idUser).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre zachytenie erroru
   * @param error
   * @return Observable<any> Vracia status kod z response
   */
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
