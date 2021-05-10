import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../services/room.service';

import {TokenService} from '../../services/token.service';
import {debounce} from 'lodash-es';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Component pre vytvorenie novej miestnosti
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {

  private _passcodeMessage: string;
  private _showForm: boolean = false;

  private _createRoomForm: FormGroup = this.formBuilder.group({
    roomName: ['', [Validators.required, Validators.minLength(2)]],
    roomPasscode: ['', [Validators.required, Validators.minLength(2)]],
  });
  constructor(private roomService: RoomService, private formBuilder: FormBuilder,
              private tokenService: TokenService, private snackBar: MatSnackBar) { }

  /** Metoda pre zobrazenie/skrytie formularu
   */
  showFormChange(): void {
    this.showForm = !this.showForm;
  }

  /** Metoda pre vytovrenie miestnosti, pokial je pristupovy kod volny(podmienka), je mozne odoslat
   * ziadost pre vytvorenie miestnosti, pokial bola miestnost vytvorena, zobrazi sa upozornenie a
   * nasledne sa formular resetuje a skryje, pokial miestnost nebola vytvorena, zobrazi sa prislusne upozornenie
   */
  createRoom(): void {
    if (this.passcodeMessage == null) {
      this.roomService.saveRoom({idRoom: 0, idOwner: Number(this.tokenService.getUserId()),
        roomName: this.createRoomForm.get('roomName').value.trim(),
        roomPasscode: this.createRoomForm.get('roomPasscode').value.trim(), active: true}).subscribe(
        response => {
          this.snackBar.open(response.message, 'x', {
            duration: 2000,
          });
          this.createRoomForm.reset();
          this.showFormChange();
        }, error => {
          if (error === 406)
          {
            this.snackBar.open('Tento kód aktuálne nie je dostupný!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          } else if (error === 404)
          {
            this.snackBar.open('Nepodarilo sa vytvoriť miestnosť!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
    } else {
      this.snackBar.open('Tento kód aktuálne nie je dostupný!', 'x', {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    }
  }

  /** Funkcia pre valdidaciu formularu - zitenie ci je pristupovy kod aktualne obsadeny,
   * Je vyuzita funkcia debounce, takze po zadanom casovom intervale kedy pouzivatel prestane
   * pisat kod, sa odosle poziadavka, ci je aktualne vlozeny kod obsadeny, ak ano zobrazi sa
   * vo formulari message, ak nie message sa skryje a pristupovy kod je validny
   * zdroj: https://www.learn2code.sk/aplikacia/skupiny#/angular/chapters/28-lodash-npm-types-debounce
   */
  isPasscodeTaken = debounce((passcode: string): void =>
  {
    if (passcode !== '')
    {
      this.roomService.isPasscodeCurrentlyUsed(passcode).subscribe(response => {
        if (response === true)
        {
          this._passcodeMessage = 'Tento kód aktuálne nie je možné použiť';
        }
        else
        {
          this._passcodeMessage = null;
        }
      }, error =>  {
        this.snackBar.open('Nepodarilo sa zistiť, či je kód aktuálne používaný!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      });
    }
  }, 500);

  /// GETTRE A SETTRE
  get createRoomForm(): FormGroup {
    return this._createRoomForm;
  }

  set createRoomForm(value: FormGroup) {
    this._createRoomForm = value;
  }
  get showForm(): boolean {
    return this._showForm;
  }

  set showForm(value: boolean) {
    this._showForm = value;
  }

  get passcodeMessage(): string {
    return this._passcodeMessage;
  }

  set passcodeMessage(value: string) {
    this._passcodeMessage = value;
  }
}
