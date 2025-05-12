import { Component } from '@angular/core';
import { TabsComponent } from "./tabs/tabs.component";
import { AddFormComponent } from "./add-form/add-form.component";
import { SearchFormComponent } from "./search-form/search-form.component";
import { TodoItemComponent } from "./todo-item/todo-item.component";
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  imports: [TabsComponent, AddFormComponent, SearchFormComponent, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {

  constructor(private todoService: TodoService) { }
  activeTab!: string;

  onSwitchTab(selectedTab: string) {
    this.activeTab = selectedTab;
  }

  onAddTodo(todo: { title: string, description: string }) {
    this.todoService.addTodo(todo.title, todo.description).subscribe({
      next: () => {
        console.log('Todo added successfully');
      },
      error: (error) => {
        console.error('Error adding todo:', error);
      }
    });
  }
}
