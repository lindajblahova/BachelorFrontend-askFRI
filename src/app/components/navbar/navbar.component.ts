import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() participant;  // 0 = register + login, 1 = participant room, 2 = log out
  @Input() room?;
  @Input() userId?;
  @Input() activeTab?;
  isOpened = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goLogIn(): void {
    this.router.navigate(['/login']);
  }

  goRegister(): void {
    this.router.navigate(['/register']);
  }

  goLogOut(): void {
    this.router.navigate(['/']);
  }

  goHome(): void {
    if (this.room != null) {
      this.router.navigate(['/home', this.room.idOwner]);
    } else {
      this.router.navigate(['/home', this.userId]);
    }
  }

  goProfile(): void {
    this.router.navigate(['/profile', this.userId]);
  }
}
