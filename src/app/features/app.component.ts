import { Component, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TodoListAngular';
  authService = inject(AuthService);

  ngOnInit() {
    
    this.authService.autoLogin();
  }
}
