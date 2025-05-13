import { Component, EventEmitter, Input, Output } from '@angular/core';
import { type todoItem } from './todo-item.model';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {

  @Input () todo!:todoItem;
  
  @Output() delete = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();
  @Output() togglePriority = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.todo.id);
  }
  onComplete() {
    this.complete.emit(this.todo.id);
  }
  onTogglePriority() {
    this.togglePriority.emit(this.todo.id);
  }

}
