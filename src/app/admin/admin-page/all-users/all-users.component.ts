import { Component, OnInit } from '@angular/core';
import {IUser} from '../../../interfaces/IUser';
import {UserService} from '../../../services/user.service';
import {RoomService} from '../../../services/room.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteProfileComponent} from '../../../components/dialog/dialog-delete-profile/dialog-delete-profile.component';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  private _errorMsg;
  private _users: IUser[];
  constructor(private userService: UserService, private roomService: RoomService, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.userService.getUsers()
      .subscribe(data => { this.users = data;
      },
        error => this.errorMsg = error);
  }

  compare(a, b): number {
    const surnameA = a.surname.toUpperCase();
    const surnameB = b.surname.toUpperCase();

    let comparison = 0;
    if (surnameA > surnameB) {
      comparison = 1;
    } else if (surnameA < surnameB) {
      comparison = -1;
    } else if (surnameA === surnameB) {
      const firstnameA = a.firstname.toUpperCase();
      const firstnameB = b.firstname.toUpperCase();
      if (firstnameA > firstnameB) {
        comparison = 1;
      } else if (firstnameA < firstnameB) {
        comparison = -1;
      }
    }
    return comparison;
  }

  openDeleteDialog(idUser: number): void {
    console.log(idUser);
    const dialogRef = this.dialog.open(DialogDeleteProfileComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true ) {
        this.userService.deleteUser(idUser).subscribe();
      }
    });
  }

  /// GETTERS AND SETTERS
  get errorMsg() {
    return this._errorMsg;
  }

  set errorMsg(value) {
    this._errorMsg = value;
  }

  get users(): IUser[] {
    return this._users;
  }

  set users(value: IUser[]) {
    this._users = value;
  }
}
