import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {map} from 'rxjs/operators';
import {IRoom} from '../../interfaces/IRoom';
import {consoleTestResultHandler} from 'tslint/lib/test';
import {IMessage} from '../../interfaces/IMessage';
import {DialogDeleteRoomComponent} from '../dialog/dialog-delete-room/dialog-delete-room.component';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteMessageComponent} from '../dialog/dialog-delete-message/dialog-delete-message.component';
import {TokenService} from '../../services/token.service';
import {UserService} from '../../services/user.service';
import {ILikedMessage} from '../../interfaces/ILikedMessage';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private _roomId: number;
  private _messages: IMessage[] = [];
  private _errorMsg: string;
  private _likes: ILikedMessage[] = [];

  msgSort;
  countLikes = [];

  private _hiddenTime: boolean[];

  private _newMessageForm = this.formBuilder.group({
    content: [''],
  });

  private _orderMessagesForm = this.formBuilder.group( {
    orderBy: '',
  });

  /// INPUTS
  private _room: IRoom;
  private _author;

  constructor( private route: ActivatedRoute, private roomService: RoomService, private messageService: MessageService,
               private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog,
               private tokenService: TokenService, private userService: UserService){ }

  ngOnInit(): void {


    this.messageService.refreshNeeded.subscribe( () => {
      this.getRoomMessages();
    });
    this.userService.refreshNeeded.subscribe( () => {
      this.getLikedMessages();
    });
    this.getRoomMessages();
    this.getLikedMessages();

  //  this.likes = new Array(this.messages.length).fill(false);
    this.hiddenTime = new Array(this.messages.length).fill(true);
  }

  getLikedMessages(): void {
    this.userService.getLikedMessages(Number(this.tokenService.getUserId())).subscribe(data => {
        this.likes = data;
        this.orderMessages(this.msgSort);
      },
      error => this.errorMsg = error);
  }

  getRoomMessages(): void {
    this.countLikes = [];
    this.roomId = Number(this.tokenService.getRoomId());
    this.msgSort = Number(this.tokenService.getMsgSort());
    console.log(this.msgSort);
    this.messageService.getRoomMessages(this.roomId).subscribe(data => {
      this.messages = data;
      this.orderMessages(this.msgSort);
      this.messages.forEach(msg => {
        this.getMessageLikesCount(msg.idMessage);
      });
    },
    error => this.errorMsg = error);
  }

  createMessage(): void {
    if (this.newMessageForm.get('content').value.trim() !== '' && this.roomId !== null && this.author !== null) {
      this.messageService.saveMessage({idMessage: 0, idRoom: this.roomId,
        content: this.newMessageForm.get('content').value.trim(), likesCount: 0, date: Date()}).subscribe(
        response => {
          console.log(response);
        });
      this.newMessageForm.reset();
    }
  }

  likeMessage(idMes: number): void {
    this.userService.likeMessage({idLikedMessage: 0, idUser: Number(this.tokenService.getUserId()), idMessage: idMes}).subscribe(
      response => {
        console.log(response);
      });
    this.countLikes.find(mes => mes.idMessage = idMes).countLike++;
  }

  unlikeMessage(idMes: number): void {
    const likedMessage = this._likes.find(e => e.idMessage === idMes);
    this.userService.unlikeMessage(likedMessage.idLikedMessage).subscribe(
      response => {
        console.log(response);
      });
    const likedMessage1 = this.countLikes.find(mes => mes.idMessage = idMes);
    console.log(this.countLikes);
  }

  isMessageLiked(idMes: number): boolean {
    return this.likes
      .some(function(el){ return el.idMessage === idMes ; });
  }

  getMessageLikesCount(idMes: number): void {
    this.messageService.getMessageLikesCount(idMes).subscribe(data => {
      this.countLikes.push({idMessage: idMes, countLike: data});
      }
    );
  }

  displayMessageTime(idMessage: number): void {
    this.hiddenTime[idMessage] = !this.hiddenTime[idMessage];
  }

  deleteMessage(idMessage: number): void {
    this.messageService.deleteMessage(idMessage).subscribe();
  }

  orderMessages(sortBy: number): void {
    this.tokenService.saveMsgSort('' + sortBy);
    if (sortBy === 1)
    {
      this._messages.sort((n1, n2) => {
        if (n1.idMessage > n2.idMessage) {
          return 1;
        }

        if (n1.idMessage < n2.idMessage) {
          return -1;
        }
        return 0;
      });
    }
    else {
      this._messages.sort((n1, n2) => {
        if (n1.idMessage < n2.idMessage) {
          return 1;
        }

        if (n1.idMessage > n2.idMessage) {
          return -1;
        }
        return 0;
      });
    }
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
  get orderMessagesForm(): FormGroup {
    return this._orderMessagesForm;
  }

  set orderMessagesForm(value: FormGroup) {
    this._orderMessagesForm = value;
  }

  get hiddenTime(): boolean[] {
    return this._hiddenTime;
  }

  set hiddenTime(value: boolean[]) {
    this._hiddenTime = value;
  }

  get newMessageForm(): FormGroup {
    return this._newMessageForm;
  }

  set newMessageForm(value: FormGroup) {
    this._newMessageForm = value;
  }
  get likes() {
    return this._likes;
  }

  set likes(value) {
    this._likes = value;
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

  get room(): IRoom {
    return this._room;
  }

  @Input()
  set room(value: IRoom) {
    this._room = value;
  }

}
