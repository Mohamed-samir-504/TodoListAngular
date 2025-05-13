import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {

  @Input () todo!:{
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'completed';
    priority: boolean;
  }
  
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
