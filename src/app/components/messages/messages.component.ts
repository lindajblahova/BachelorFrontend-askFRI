import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {FormBuilder} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {map} from 'rxjs/operators';
import {IRoom} from '../../interfaces/IRoom';
import {consoleTestResultHandler} from 'tslint/lib/test';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @Input() room: IRoom;
  rooms = [];
  roomId;
  messages = [];
  errorMsg;
  like = false;
  clickedId;
  @Input() author = false;

  newMessageForm = this.formBuilder.group({
    content: ''
  });

  constructor( private route: ActivatedRoute, private roomService: RoomService, private messageService: MessageService,
               private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = Number(params.get('roomId'));
    });

    this.messageService.getRoomMessages(this.roomId).subscribe(data => this.messages = data);
  }

  onSubmit(): void {
    this.messageService.addMessage(this.room.idRoom, this.newMessageForm.get('content').value);
    console.log(this.newMessageForm.get('content').value);
    this.newMessageForm.reset();
    if (this.author) {
      this.router.navigate(['/rooms', this.room.idRoom]);
    } else {
      this.router.navigate(['/participant-rooms/', this.room.idRoom]);
    }

  }

  onClick(idMessage): void {
    this.like = !this.like;
    this.clickedId = idMessage;
  }
}
