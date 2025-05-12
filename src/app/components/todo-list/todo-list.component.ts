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

  todos: any[] = [];
  activeTab: string = 'todo';
  searchText: string = '';

  constructor(private todoService: TodoService) {
    todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
      }
    });
  }

  get filteredTodos() {

    return this.todos
      .filter(todo => todo.status === this.activeTab)
      .filter(todo => todo.title.toLowerCase().includes(this.searchText.toLowerCase()))
      .sort((a, b) => {
        if (a.priority === 0 && b.priority === 0) {
          const aTime = a.timestamp?.toDate?.().getTime?.() ?? 0;
          const bTime = b.timestamp?.toDate?.().getTime?.() ?? 0;
          return bTime - aTime; // Newer first
        }
        return b.priority - a.priority;

      });
  }


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

  onSearchInput(searchedText: string) {
    this.searchText = searchedText;
  }

  onDeleteTodo(todoId: string) {
    this.todoService.deleteTodo(todoId).subscribe({
      next: () => {
        console.log('Todo deleted successfully');
        this.todos = this.todos.filter(todo => todo.id !== todoId);
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
      }
    });
  }

  onCompleteTodo(todoId: string) {
    this.todoService.updateStatus(todoId, "completed").subscribe({
      next: () => {
        console.log('Todo completed successfully');
        const todo = this.todos.find(todo => todo.id === todoId);
        if (todo) {
          todo.status = 'completed';
        }
      },
      error: (error) => {
        console.error('Error completing todo:', error);
      }
    });
  }

  onTogglePriority(todoId: string) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (todo) {
      const newPriority = todo.priority ? 0 : 1;
      this.todoService.updatePriority(todoId, newPriority).subscribe({
        next: () => {
          console.log('Todo priority updated successfully');
          todo.priority = newPriority;
        },
        error: (error) => {
          console.error('Error updating todo priority:', error);
        }
      });
    }
  }


}
