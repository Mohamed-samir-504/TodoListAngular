import { Component } from '@angular/core';

import { TodoListComponent } from './todo-list/todo-list.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [TodoListComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TodoListAngular';
}
