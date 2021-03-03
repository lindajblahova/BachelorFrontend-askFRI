import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {map} from 'rxjs/operators';
import {IRoom} from '../../interfaces/IRoom';
import {consoleTestResultHandler} from 'tslint/lib/test';
import {IMessage} from '../../interfaces/IMessage';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private _roomId;
  private _messages = [];
  private _errorMsg;
  private _likes;

  private _newMessageForm = this.formBuilder.group({
    content: [''],
  });

  /// INPUTS
  private _room: IRoom;
  private _author;

  constructor( private route: ActivatedRoute, private roomService: RoomService, private messageService: MessageService,
               private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
    });

    this.messageService.getRoomMessages(this.roomId).subscribe(data => this.messages = data,
                                                                    error => this.errorMsg = error);
    this.likes = new Array(this.messages.length).fill(false);
  }

  onSubmit(): void {
    // this.messageService.addMessage(this.room.idRoom, this.newMessageForm.get('content').value);
    if (this.newMessageForm.get('content').value.trim() !== '') {
      console.log(this.newMessageForm.get('content').value.trim());
      this.newMessageForm.reset();
    }
    if (this.author) {
      this.router.navigate(['/rooms', this.room.idRoom]);
    } else {
      this.router.navigate(['/participant-rooms/', this.room.idRoom]);
    }
  }

  likeMessage(idMessage: number): void {
    this.likes[idMessage] = !this.likes[idMessage];
  }

  deleteMessage(idMessage: number): void {
    console.warn(idMessage);
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
