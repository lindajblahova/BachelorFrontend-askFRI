import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {FormBuilder, FormGroup } from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {IRoom} from '../../interfaces/IRoom';
import {IMessage} from '../../interfaces/IMessage';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteMessageComponent} from '../dialog/dialog-delete-message/dialog-delete-message.component';
import {TokenService} from '../../services/token.service';
import {UserService} from '../../services/user.service';
import {onErrorResumeNext} from 'rxjs';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  private _roomId: number;
  private _messages: IMessage[] = [];
  private _errorMsg: string;
  private interval;

  private _newMessageForm = this.formBuilder.group({
    content: [''],
  });


  /// INPUTS
  private _author;

  constructor( private route: ActivatedRoute, private roomService: RoomService, private messageService: MessageService,
               private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog,
               private tokenService: TokenService, private userService: UserService){ }

  ngOnInit(): void {
    this.messageService.refreshNeeded.subscribe( () => {
      this.getRoomMessages();
    });

    this.getRoomMessages();

    this.interval = setInterval(() => {this.getRoomMessages(); }, 10000);

  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getRoomMessages(): void {
    this.roomId = Number(this.tokenService.getRoomId());
    this.messageService.getRoomMessages(this.roomId).subscribe(data => {
      this.messages = data;
    },
    error => this.errorMsg = error);
  }

  createMessage(): void {
    if (this.newMessageForm.get('content').value.trim() !== '' && this.roomId !== null && this.author !== null) {
      this.messageService.saveMessage({idMessage: 0, idRoom: this.roomId,
        content: this.newMessageForm.get('content').value.trim() }).subscribe(
        response => {
        }, error => this.errorMsg = error);
      this.newMessageForm.reset();
    }
  }

  deleteMessage(idMessage: number): void {
    this.messageService.deleteMessage(idMessage).subscribe();
  }

  openDeleteDialog(idMessage: number): void {
    const dialogRef = this.dialog.open(DialogDeleteMessageComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.deleteMessage(idMessage);
      }
    });
  }

  /// GETTERS AND SETTERS
  get newMessageForm(): FormGroup {
    return this._newMessageForm;
  }

  set newMessageForm(value: FormGroup) {
    this._newMessageForm = value;
  }

  get errorMsg() {
    return this._errorMsg;
  }

  set errorMsg(value) {
    this._errorMsg = value;
  }
  get messages(): any[] {
    return this._messages;
  }

  set messages(value: any[]) {
    this._messages = value;
  }

  get roomId() {
    return this._roomId;
  }

  set roomId(value) {
    this._roomId = value;
  }

  get author() {
    return this._author;
  }

  @Input()
  set author(value) {
    this._author = value;
  }

}
