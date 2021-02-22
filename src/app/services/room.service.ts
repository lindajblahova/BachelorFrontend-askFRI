import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError as observableThrowError, Observable} from 'rxjs';
import {IRoom} from '../interfaces/IRoom';
import {catchError, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private url = '/assets/data/rooms.json';
  constructor(private http: HttpClient) { }

  addRoom(roomName, roomPasscode): void {}

  getRooms(): Observable<IRoom[]> {
    return this.http.get<IRoom[]>(this.url).pipe(catchError(this.errorHandler));
  }

  findRoom(id: number): Observable<IRoom>{
    return this.getRooms().pipe(
      map(findR => findR.find(room => room.idRoom === id))
    );
  }

  findUserRooms(id: number): Observable<IRoom[]> {
    return this.getRooms().pipe(
      map(findR => findR.filter(room => room.idOwner === id))
    );
  }

  deleteRoom(roomId): void {
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
