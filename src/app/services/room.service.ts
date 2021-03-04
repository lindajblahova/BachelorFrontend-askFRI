import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {throwError as observableThrowError, Observable} from 'rxjs';
import {IRoom} from '../interfaces/IRoom';
import {catchError, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private url = '/assets/data/rooms.json';
  constructor(private http: HttpClient) { }

  saveRoom(room: IRoom): Observable<IRoom> {
    return this.http.post<IRoom>(this.url, room).pipe(catchError(this.errorHandler));
  }

  deleteRoom(roomId): Observable<HttpEvent<IRoom>> {
    return this.http.delete(this.url, roomId).pipe(catchError(this.errorHandler));
  }

  getRooms(): Observable<IRoom[]> {
    return this.http.get<IRoom[]>(this.url).pipe(catchError(this.errorHandler));
  }

  findRoom(id: number): Observable<IRoom>{
    return this.getRooms().pipe(
      map(findR => findR.find(room => room.idRoom === id))
    );
  }

  doesPasscodeExist(passcode: string): Observable<IRoom>{
    return this.getRooms().pipe(
      map(findR => findR.find(room => room.roomPasscode === passcode))
    );
  }

  findUserRooms(id: number): Observable<IRoom[]> {
    return this.getRooms().pipe(
      map(findR => findR.filter(room => room.idOwner === id))
    );
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || 'Server error');
  }
}
