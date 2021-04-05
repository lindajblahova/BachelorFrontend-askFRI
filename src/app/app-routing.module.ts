import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EnterRoomComponent} from './pages/enter-room/enter-room.component';
import {ParticipantRoomComponent} from './pages/participant-room/participant-room.component';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './pages/register/register.component';
import {RoomComponent} from './pages/room/room.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {AdminPageComponent} from './admin/admin-page/admin-page.component';
import {AuthGuard} from './auth/auth.guard';
import {CreateRoomComponent} from './components/create-room/create-room.component';



const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'enter-room/:userId', component: EnterRoomComponent},
  {path: 'home', component: HomeComponent},
  {path: 'home/create-room', component: HomeComponent},
  {path: 'participant-rooms/:userId/:roomId', component: ParticipantRoomComponent, },
  {path: 'rooms/:userId/:roomId', component: RoomComponent, },
  {path: 'profile/:userId', component: ProfileComponent, },
  {path: 'adminHome/:userId', component: AdminPageComponent, },
  // canActivate: [AuthGuard]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
