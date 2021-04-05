import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import {IRoom} from '../interfaces/IRoom';
import {catchError, map, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoomService {

 // private url = '/assets/data/rooms.json';
  private _refreshNeeded = new Subject<void>();
  constructor(private http: HttpClient) { }

  get refreshNeeded(): Subject<void> {
    return this._refreshNeeded;
  }

  saveRoom(room: IRoom): Observable<IRoom> {
    return this.http.post<IRoom>('http://localhost:8080/api/rooms/add', room).pipe(catchError(this.errorHandler))
      .pipe( tap(() => {
        this._refreshNeeded.next();
      }));
  }

  deleteRoom(roomId): Observable<HttpEvent<IRoom>> {
    return this.http.delete('http://localhost:8080/api/rooms/delete', roomId).pipe(catchError(this.errorHandler));
  }

  updateRoom(room: IRoom): Observable<IRoom> {
    return this.http.put<IRoom>('http://localhost:8080/api/rooms/update/inactive', room).pipe(catchError(this.errorHandler));
  }

  getRooms(): Observable<IRoom[]> {
    return this.http.get<IRoom[]>('http://localhost:8080/api/rooms/get').pipe(catchError(this.errorHandler));
  }

  findRoom(idRoom: number): Observable<IRoom> {
    return this.http.post<number>('http://localhost:8080/api/rooms/get', idRoom).pipe(catchError(this.errorHandler));
  }

  findUserRooms(idUser: number): Observable<IRoom[]> {
    return this.http.post<number>('http://localhost:8080/api/rooms/get/user', idUser).pipe(catchError(this.errorHandler));
  }
  /*
  findRoom(id: number): Observable<IRoom>{
    return this.getRooms().pipe(
      map(findR => findR.find(room => room.idRoom === id))
    );
  }*/

  /*findUserRooms(id: number): Observable<IRoom[]> {
    return this.getRooms().pipe(
      map(findR => findR.filter(room => room.idOwner === id))
    );
  }*/

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
