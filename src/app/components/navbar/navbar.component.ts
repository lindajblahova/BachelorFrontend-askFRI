import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goLogIn(): void {
    this.router.navigate(['/login']);
  }

  goRegister(): void {
    this.router.navigate(['/register']);
  }

  goParticipant(): void {
    this.router.navigate(['/participant-rooms', 1]);
  }

}
