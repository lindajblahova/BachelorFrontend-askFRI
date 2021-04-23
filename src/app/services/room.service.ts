import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders} from '@angular/common/http';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import {IRoom} from '../interfaces/IRoom';
import {catchError, map, tap} from 'rxjs/operators';
import {IResponse} from '../interfaces/IResponse';

/** Service pre manipulaciu s Room
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private _refreshNeeded = new Subject<void>();
  constructor(private http: HttpClient) { }

  /** getter pre refresh komponentu
   * zdroj: https://www.youtube.com/watch?v=DvnzeCfYg0s&t=42s
   * @return Subject<void>
   */
  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  /** Metoda pre vytvorenie miestnosti
   * @param room
   * @return Observable<IResponse> response
   */
  saveRoom(room: IRoom): Observable<IResponse> {
    return this.http.post<IRoom>('http://localhost:8080/api/rooms/add', room).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre vymazanie miestnosti pomocou id
   * @param roomId
   * @return Observable<IResponse> response
   */
  deleteRoom(roomId: number): Observable<IResponse>  {
    return this.http.delete('http://localhost:8080/api/rooms/delete/' + roomId).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre zistenie, ci je kod aktualne pouzivany
   * @param passcode
   * @return Observable<boolean>
   */
  isPasscodeCurrentlyUsed(passcode: string): Observable<boolean> {
    return this.http.get<string>('http://localhost:8080/api/rooms/get/passcode/' + passcode).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre najdenie miestnosti pomocou kodu
   * @param passcode
   * @return Observable<IRoom> miestnost
   */
  getActiveRoomByPasscode(passcode: string): Observable<IRoom> {
    return this.http.get<string>('http://localhost:8080/api/rooms/get/room-passcode/' + passcode).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre update pristupoveho kodu miestnosti
   * @param room
   * @return Observable<IResponse> response
   */
  updateRoomPasscode(room: IRoom): Observable<IResponse> {
    return this.http.put<IRoom>('http://localhost:8080/api/rooms/update/passcode', room).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre update aktivity miestnosti
   * @param idRoom
   * @return Observable<IResponse> response
   */
  updateRoomActivity(idRoom: number): Observable<IResponse> {
    return this.http.put<number>('http://localhost:8080/api/rooms/update/activity/', idRoom).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  /** Metoda pre ziskanie miestnosti pomocou id
   * @param id
   * @return Observable<IRoom> miestnost
   */
  getRoom(id: number): Observable<IRoom> {
    return this.http.get<IRoom>('http://localhost:8080/api/rooms/get/room/' + id).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre ziskanie vsetkych miestnosti pouzivatela pomocou jeho id
   * @param idUser
   * @return Observable<IRoom[]> pole miestnosti
   */
  findUserRooms(idUser: number): Observable<IRoom[]> {
    return this.http.get<number>('http://localhost:8080/api/rooms/get/user/' + idUser).pipe(catchError(this.errorHandler));
  }

  /** Metoda pre zachytenie erroru
   * @param error
   * @return Observable<any> Vracia status kod z response
   */
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.status || 'Server error');
  }
}
