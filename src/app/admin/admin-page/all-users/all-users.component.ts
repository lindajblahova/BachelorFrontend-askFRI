import {Component, Input, OnInit} from '@angular/core';
import {IUser} from '../../../interfaces/IUser';
import {UserService} from '../../../services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteProfileComponent} from '../../../components/dialog/dialog-delete-profile/dialog-delete-profile.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AdminService} from '../../../services/admin.service';
import {IUserProfile} from '../../../interfaces/IUserProfile';

/** Component pre zoznam vsetkych pouzivatelov pre admina
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  private _users: IUserProfile[];

  /** Tento atribut je vstupom z rodicovskeho komponentu admin-page
   */
  // INPUT
  private _isAdmin: boolean = false;
  constructor(private userService: UserService, private adminService: AdminService,
              private dialog: MatDialog, private snackBar: MatSnackBar) { }

  /** Po vymazani nietoreho z pouzivatelov sa refreshne komponent, preto je tam subscription
   * na refreshNeeded
   */
  ngOnInit(): void {
    this.userService.refreshNeeded.subscribe( () => {
      this.getUsers();
    });
    this.getUsers();
  }

  /** Metoda pre ziskanie profilovych udajov vsetkych pouzivatelov
   * Pokusi sa ziskat pole vsetkych pouzivatelov a nasledne ich utriedi podla priezviska
   * a podla mena. V pripade neuspesnej akcie sa zobrazi prislusne upozornenie
   */
  getUsers(): void {
    this.adminService.getUsers()
      .subscribe(data => {
        this.users = data;
        this.users.sort((a, b) => {
          const surnameA = a.surname.toUpperCase();
          const surnameB = b.surname.toUpperCase();
          if (surnameA > surnameB) {
            return 1;
          } else if (surnameA < surnameB) {
            return -1;
          } else if (surnameA === surnameB) {
            const firstnameA = a.firstname.toUpperCase();
            const firstnameB = b.firstname.toUpperCase();
            if (firstnameA > firstnameB) {
              return 1;
            } else if (firstnameA < firstnameB) {
              return -1;
            }
            return 0;
          }
          return 0;
        }); },
        error => {
           if (error === 403)
          {
            this.snackBar.open('Nemáte oprávnenie pre túto akciu!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
  }

  /** Metoda pre vymazanie pouzivatela, Otvori dialog pre vymzanaie pouzivatela a
   * v pripade kladneho vysledku odosle ziadost pre vymazanie pouzivatela. Nasledne
   * sa zobrazi prislusne upozornenie o vykonani/nevykonanie akcie
   * @param idUser
   */
  openDeleteDialog(idUser: number): void {
    console.log(idUser);
    const dialogRef = this.dialog.open(DialogDeleteProfileComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true ) {
        this.userService.deleteUser(idUser).subscribe(data => {
          this.snackBar.open(data.message, 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-accent']
          });
        }, error => {
          if (error === 404) {
            this.snackBar.open('Používateľa sa nepodarilo vymazať!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          } else if (error === 403)
          {
            this.snackBar.open('Nemáte operávnenie pre túto akciu!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
      }
    });
  }

  /// GETTRE A SETTRE
  get isAdmin(): boolean {
    return this._isAdmin;
  }
  @Input()
  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }

  get users(): IUserProfile[] {
    return this._users;
  }

  set users(value: IUserProfile[]) {
    this._users = value;
  }
}
