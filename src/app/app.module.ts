import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EnterRoomComponent } from './pages/enter-room/enter-room.component';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { MessagesComponent } from './components/messages/messages.component';
import { ParticipantRoomComponent } from './pages/participant-room/participant-room.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import {RoomComponent} from './pages/room/room.component';
import { PollComponent } from './components/poll/poll.component';
import { CreatePollComponent } from './components/poll/create-poll/create-poll.component';
import { QuestionsComponent } from './components/poll/questions/questions.component';
import { AnswersComponent } from './components/poll/questions/answers/answers.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EnterRoomComponent,
    MessagesComponent,
    ParticipantRoomComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    CreateRoomComponent,
    RoomsComponent,
    RoomComponent,
    PollComponent,
    CreatePollComponent,
    QuestionsComponent,
    AnswersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
