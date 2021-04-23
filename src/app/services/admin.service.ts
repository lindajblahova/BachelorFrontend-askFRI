import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {IUser} from '../interfaces/IUser';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {IRoom} from '../interfaces/IRoom';
import {IUserProfile} from '../interfaces/IUserProfile';

/** Service GET requesty pre Administratora
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  /** Metoda pre ziskanie profilovych udajov vsetkych pouzivatelov
   * @return Observable<IUser[]> pole vsetkych pouzivatelov
   */
  getUsers(): Observable<IUserProfile[]> {
    return this.http.get<IUserProfile[]>('http://localhost:8080/api/admin/users/all').pipe(catchError(this.errorHandler));
  }

  /** Metoda pre ziskanie vsetkych miestnosti
   * @return Observable<IRoom[]> pole vsetkych miestnosti
   */
  getRooms(): Observable<IRoom[]> {
    return this.http.get<IRoom[]>('http://localhost:8080/api/admin/rooms/all').pipe(catchError(this.errorHandler));
  }

  /** Metoda pre zachytenie erroru
   * @param error
   * @return Observable<any> Vracia status kod z response
   */
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
