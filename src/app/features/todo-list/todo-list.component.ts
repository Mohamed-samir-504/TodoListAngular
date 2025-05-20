import { Component } from '@angular/core';
import { TabsComponent } from "./tabs/tabs.component";
import { AddFormComponent } from "./add-form/add-form.component";
import { SearchFormComponent } from "./search-form/search-form.component";
import { TodoItemComponent } from "./todo-item/todo-item.component";
import { TodoService } from './todo.service';
import { Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  imports: [TabsComponent, AddFormComponent, SearchFormComponent, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {

  private todosSub!: Subscription;

  todos: any[] = [];
  activeTab: string = 'todo';
  searchText: string = '';
  userId!: string;


  constructor(private todoService: TodoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')!;

    this.todosSub = this.todoService.getTodos().subscribe({
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
      .filter(todo => todo.userId === this.userId)
      .filter(todo => todo.status === this.activeTab)
      .filter(todo => todo.title.toLowerCase().includes(this.searchText.toLowerCase()))
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }

        // If both priorities are the same, sort by timestamp (newest first)
        const aTime = a.timestamp?.getTime?.() ?? 0;
        const bTime = b.timestamp?.getTime?.() ?? 0;
        return bTime - aTime;
      });
  }


  onSwitchTab(selectedTab: string) {
    this.activeTab = selectedTab;
  }

  onSearchInput(searchedText: string) {
    this.searchText = searchedText;
  }

  onAddTodo(todo: { title: string, description: string }): void {
    this.todoService.addTodo(todo.title, todo.description, this.userId).pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  onDeleteTodo(todoId: string) {
    this.todoService.deleteTodo(todoId).pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  onCompleteTodo(todoId: string) {
    this.todoService.updateStatus(todoId, "completed").pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  onTogglePriority(todoId: string) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (todo) {
      const newPriority = todo.priority ? false : true;
      this.todoService.updatePriority(todoId, newPriority).pipe(
        switchMap(() => this.todoService.getTodos())
      ).subscribe({
        next: (todos) => {
          this.todos = todos;
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.todosSub.unsubscribe();
  }


}
