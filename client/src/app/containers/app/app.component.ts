import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../modules/auth/shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    const user = this.authService.fetchCurrentUser;
    // TODO
  }
}
