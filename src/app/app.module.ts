import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EnterRoomComponent } from './pages/enter-room/enter-room.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MessagesComponent } from './components/messages/messages.component';
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
import { AnswerQuestionComponent } from './components/poll/questions/answer-question/answer-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MaterialModule} from './material/material.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { DialogDeleteProfileComponent } from './components/dialog/dialog-delete-profile/dialog-delete-profile.component';
import { DialogReactivateRoomComponent } from './components/dialog/dialog-reactivate-room/dialog-reactivate-room.component';
import { DialogDeleteRoomComponent } from './components/dialog/dialog-delete-room/dialog-delete-room.component';
import { DialogDeleteMessageComponent } from './components/dialog/dialog-delete-message/dialog-delete-message.component';
import { DialogDeleteQuestionComponent } from './components/dialog/dialog-delete-question/dialog-delete-question.component';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { AllRoomsComponent } from './admin/admin-page/all-rooms/all-rooms.component';
import { AllUsersComponent } from './admin/admin-page/all-users/all-users.component';
import { CookieService } from 'ngx-cookie-service';
import {AuthGuard} from './auth/auth.guard';
import {AuthInterceptorService} from './services/auth-interceptor.service';
import {AuthService} from './services/auth.service';
import {TeacherGuard} from './auth/teacher.guard';
import {AdminGuard} from './auth/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EnterRoomComponent,
    MessagesComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    CreateRoomComponent,
    RoomsComponent,
    RoomComponent,
    PollComponent,
    CreatePollComponent,
    QuestionsComponent,
    AnswersComponent,
    AnswerQuestionComponent,
    ProfileComponent,
    DialogDeleteProfileComponent,
    DialogReactivateRoomComponent,
    DialogDeleteRoomComponent,
    DialogDeleteMessageComponent,
    DialogDeleteQuestionComponent,
    AdminPageComponent,
    AllRoomsComponent,
    AllUsersComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        ScrollingModule
    ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}, CookieService,
    AdminGuard, TeacherGuard , AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
