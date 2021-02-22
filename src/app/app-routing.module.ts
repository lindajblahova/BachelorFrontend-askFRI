import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EnterRoomComponent} from './pages/enter-room/enter-room.component';
import {ParticipantRoomComponent} from './pages/participant-room/participant-room.component';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './pages/register/register.component';
import {RoomComponent} from './pages/room/room.component';


const routes: Routes = [
  {path: '', component: EnterRoomComponent},
  {path: 'participant-rooms/:roomId', component: ParticipantRoomComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home/:userId', component: HomeComponent},
  {path: 'rooms/:roomId', component: RoomComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
