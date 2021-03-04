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

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private _roomId: number;
  private _messages: IMessage[] = [];
  private _errorMsg: string;
  private _likes: boolean[];

  private _newMessageForm = this.formBuilder.group({
    content: [''],
  });

  /// INPUTS
  private _room: IRoom;
  private _author;

  constructor( private route: ActivatedRoute, private roomService: RoomService, private messageService: MessageService,
               private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
    });

    this.messageService.getRoomMessages(this.roomId).subscribe(data => this.messages = data,
                                                                    error => this.errorMsg = error);
    this.likes = new Array(this.messages.length).fill(false);
  }

  createMessage(): void {
    // this.messageService.addMessage(this.room.idRoom, this.newMessageForm.get('content').value);
    if (this.newMessageForm.get('content').value.trim() !== '' || this.room !== undefined || this.author !== undefined) {
      this.messageService.saveMessage({idMessage: 0, idRoom: this.room.idRoom,
        content: this.newMessageForm.get('content').value.trim(), likesCount: 0}).subscribe(
        response => {
          console.log(response);
        });

      if (this.author) {
        this.router.navigate(['/rooms', this.room.idRoom]);
      } else {
        this.router.navigate(['/participant-rooms/', this.room.idRoom]);
      }
      this.newMessageForm.reset();
    }
  }

  likeMessage(idMessage: number): void {
    this.likes[idMessage] = !this.likes[idMessage];
  }

  deleteMessage(idMessage: number): void {
    console.warn(idMessage);
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteMessageComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /// GETTERS AND SETTERS
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
