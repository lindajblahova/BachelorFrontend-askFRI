import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../rooms/rooms.component';

/** Component pre dialogove okno pre upravenie pristupoveho kodu miestnosti
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-dialog-reactivate-room',
  templateUrl: './dialog-reactivate-room.component.html',
  styleUrls: ['./dialog-reactivate-room.component.css']
})
export class DialogReactivateRoomComponent {

  /** Do konstruktora su vkladane data z komponentu, ktory zavolal otvorenie dialogoveho
   * okna
   * @param dialogRef
   * @param data
   */
  constructor(public dialogRef: MatDialogRef<DialogReactivateRoomComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

}
