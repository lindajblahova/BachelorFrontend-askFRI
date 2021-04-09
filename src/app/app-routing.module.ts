import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EnterRoomComponent} from './pages/enter-room/enter-room.component';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './pages/register/register.component';
import {RoomComponent} from './pages/room/room.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {AdminPageComponent} from './admin/admin-page/admin-page.component';
import {AuthGuard} from './auth/auth.guard';
import {TeacherGuard} from './auth/teacher.guard';



const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'enter-room', component: EnterRoomComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard, TeacherGuard]},
  {path: 'room', component: RoomComponent, canActivate: [AuthGuard] },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'adminHome', component: AdminPageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
