import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {FormBuilder, FormGroup } from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteMessageComponent} from '../dialog/dialog-delete-message/dialog-delete-message.component';
import {TokenService} from '../../services/token.service';
import {UserService} from '../../services/user.service';
import {IMessageWithLike} from '../../interfaces/IMessageWithLike';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

/** Component pre konverzaciu v miestnosti
 * pouziva XLSX z balika xlsx
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  private fileName: string;
  private _messages: IMessageWithLike[] = [];
  private interval;
  msgSort: number;

  private _newMessageForm = this.formBuilder.group({
    content: [''],
  });

  /** Vstupy z rodicovskeho komponentu - miestnosti, urcujuce, ci je pouzivatel v miestnosti
   * ako jej autor alebo nie, autor ma pravo mazat spravy v miestnosti, aj to iba za podmienky,
   * ze skutocne je autorom miestnosti
   */
  /// INPUTS
  private _author = false;
  private _isLoggedIn;

  constructor( private roomService: RoomService, private messageService: MessageService,
               private formBuilder: FormBuilder, private dialog: MatDialog,
               private tokenService: TokenService, private userService: UserService, private snackBar: MatSnackBar){ }

  /** Na zaciatku sa z cookies vyberie predvoleny sposob triedenia sprav a nacitaju sa spravy miesntosti,
   * opat je ouzity refresh needed pre obnovenie komponentu, teda znovu nacitanie, ale aby konverzacia
   * mohla sluzit ako online chat, je nastaveny aj autmaticky refresh komponentu kazde 3 sekundy, pomocou
   * funkcie setInterval
   * zdroj: https://stackoverflow.com/questions/37116619/angular-2-setinterval-keep-running-on-other-component
   */
  ngOnInit(): void {
    this.msgSort = Number(this.tokenService.getMsgSort());
    this.messageService.refreshNeeded.subscribe( () => {
      this.getRoomMessages();
    });
    this.userService.refreshNeeded.subscribe( () => {
      this.getRoomMessages();
    });

    this.getRoomMessages();
    this.interval = setInterval(() => {this.getRoomMessages(); }, 3000);
  }

  /** Ked uz komponent nie je viac zobrazovany, je potrebne zrusit automaticke obnovovanie funkciou setInterval()
   * zdroj: https://stackoverflow.com/questions/37116619/angular-2-setinterval-keep-running-on-other-component
   */
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /** Metoda nacita pomocou pristusnej service vsetky spravy patriace do danej miestnosti (spolocne s ich reakciami)
   * a nasledne ich zoradi metodou orderMessages(), pokial nebolo mozne nacitat spravy, zobrazi sa upozornenie
   */
  getRoomMessages(): void {
    this.messageService.getRoomMessages(Number(this.tokenService.getRoomId())).subscribe(data => {
      this.messages = data;
      this.orderMessages();
    },
    error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa načítať dáta', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre zmenu triedenia sprav od najnovsich/najoblubenejsich, ulozi do cookies novy
   * zvoleny sposob triedenia
   * @param sortBy
   */
  changeMessagesSortType(sortBy: number): void {
    this.tokenService.saveMsgSort('' + sortBy);
    this.getRoomMessages();
  }

  /** Metoda utriedi pole sprav podla zvoleneho triedenia z cookies, bud podla velkosti pola
   * set reakcii zostupne, teda od najvacsieho poctu reakcii, alebo podla id spravy zostupne,
   * teda on najnovsich
   */
  orderMessages(): void {
    if (Number(this.tokenService.getMsgSort()) === 1)
    {
      this._messages.sort((n1, n2) => {
        if (n1.setLikes.length < n2.setLikes.length ) {
          return 1;
        }

        if (n1.setLikes.length > n2.setLikes.length ) {
          return -1;
        }

        if (n1.setLikes.length === n2.setLikes.length ) {
          if (n1.message.idMessage > n2.message.idMessage ) {
            return 1;
          }

          if (n1.message.idMessage < n2.message.idMessage ) {
            return -1;
          }
        }
      });
    }
    else {
      this._messages.sort((n1, n2) => {
        if (n1.message.idMessage < n2.message.idMessage) {
          return 1;
        }

        if (n1.message.idMessage > n2.message.idMessage) {
          return -1;
        }
        return 0;
      });
    }
  }

  /** Metoda pre odoslanie novej spravy pomocou hodnoty z formulara. Pokial su splnene vsetky podmienky
   * je odoslana sprava pre ulozenie a v pripade neuspesnej akcie sa zobrazi upozornenie o neodoslani.
   * Ak sprava bola uspesne odoslana, sposobi to refresh komponentu a sprava sa zobrazi v zozname sprav
   * miesnosti, podla zvoleneho triedenia.
   */
  createMessage(): void {
    if (this.newMessageForm.get('content').value !== null &&
      this.newMessageForm.get('content').value.trim() !== ''
      && Number(this.tokenService.getRoomId()) !== null && this.author !== null) {
      this.messageService.saveMessage({idMessage: 0, idRoom: Number(this.tokenService.getRoomId()),
        content: this.newMessageForm.get('content').value.trim()}).subscribe(
        response => {
        }, error => {
          if (error === 406) {
            this.snackBar.open('Správa nebola odoslaná!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
      this.newMessageForm.reset();
    }
  }

  /** Metoda pre vymazanie spravy, odosle sa ziadost pre vymazanie spravy s konkretnym ID,
   * ak by akcia prebehla neuspesne, zobrazi sa upozornenie, po uspesnom vymazani sa vykona
   * refresh komponentu, takze sprava zmizne zo zoznamu sprav
   * @param idMessage
   */
  deleteMessage(idMessage: number): void {
    this.messageService.deleteMessage(idMessage).subscribe(data => {}, error => {
      if (error === 404)
      {
        this.snackBar.open('Nepodarilo sa vymazať správu', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Po kliknuti na tlacidlo pre zmazanie spravy sa otvori dialogove okno pre potvrdenie zmazania
   * a pokial bolo zmazanie potvrdene, zavola sa metoda pre zmazanie spravy
   * @param idMessage
   */
  openDeleteDialog(idMessage: number): void {
    const dialogRef = this.dialog.open(DialogDeleteMessageComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.deleteMessage(idMessage);
      }
    });
  }

  /** Metoda pre zistenie, ci pouzivatel na spravu uz reagoval, alebo nie (sluzi pre zobrazenie
   * roznych ikon pre spravy na ktore uz bolo pouzivatelom reagovane a na ktore nie)
   * Metoda sa teda pokusi najst pre danu spravu set reakcii v ktorom vyhlada zaznam s id pouzivatela
   * @param message
   */
  isMessageLiked(message: IMessageWithLike): boolean {
    return message.setLikes.findIndex(data => data.idUser === Number(this.tokenService.getUserId())) !== -1;
  }

  /** Metoda pre odoslanie reakcie pouzivatelom na vybranu spravu. Odosle ziadost o ulozenie reakcie
   * pokial akcia neprebehla uspesne, vypise prislusne upozornenie, pokial prebehla uspesne, refreshne
   * sa komponent a zmeni sa ikona pri sprave, na ktoru pouzivatel regoval na "uz reagovanu - ♥ "
   * @param idMessagePar
   */
  likeMessage(idMessagePar: number): void {
    this.userService.likeMessage({idUser: Number(this.tokenService.getUserId()),
      idMessage: idMessagePar}).subscribe(data => {},
      error => {
        if (error === 400)
        {
          this.snackBar.open('Nepodarilo sa odoslať reakciu!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
  }

  /** Metoda pre zrusenie odoslanej reakcie pouzivatelom na vybranu spravu. Odosle ziadost o zrusenie reakcie
   * pokial akcia neprebehla uspesne, vypise prislusne upozornenie, pokial prebehla uspesne, refreshne
   * sa komponent a zmeni sa ikona pri sprave, na ktoru pouzivatel regoval na "este nereagovanu -  prazdne srdce "
   * @param idMessagePar
   */
  unlikeMessage(idMessagePar: number): void {
    this.userService.unlikeMessage({idUser: Number(this.tokenService.getUserId()), idMessage: idMessagePar}).subscribe( data => {},
      error => {
      if (error === 404)
      {
        this.snackBar.open('Nepodarilo sa vymazať reakciu!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
      });
  }

  /** Metoda pre exportovanie zoznamu sprav s reakciami do suboru excel, pomocou balicka xlsx,
   * prebrate zo zdroja
   * zdroj: https://jsonworld.com/demo/how-to-export-data-to-excel-file-in-angular-application
   */
  exportexcel(): void {
    const date = new Date();

    this.fileName = 'OtázkyPoslucháčov-'
      + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + '.xlsx';
    const element = document.getElementById('excel-table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, this.fileName);
  }

  /// GETTRE A SETTRE
  get messages(): IMessageWithLike[] {
    return this._messages;
  }

  set messages(value: IMessageWithLike[]) {
    this._messages = value;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  get newMessageForm(): FormGroup {
    return this._newMessageForm;
  }

  set newMessageForm(value: FormGroup) {
    this._newMessageForm = value;
  }

  get author() {
    return this._author;
  }

  @Input()
  set author(value) {
    this._author = value;
  }

}
