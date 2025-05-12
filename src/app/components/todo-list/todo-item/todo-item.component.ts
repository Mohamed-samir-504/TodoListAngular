import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() status!: 'todo' | 'completed';
  @Input() priority: boolean = false;

  @Output() delete = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();
  @Output() togglePriority = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.id);
  }
  onComplete() {
    this.complete.emit(this.id);
  }
  onTogglePriority() {
    this.togglePriority.emit(this.id);
  }

}
