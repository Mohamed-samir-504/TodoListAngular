import { Component, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TodoListAngular';
  private authService = inject(AuthService);
  ngOnInit() {
    this.authService.autoLogin();
  }
}
