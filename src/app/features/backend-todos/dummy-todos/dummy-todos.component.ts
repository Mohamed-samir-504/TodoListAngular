import { Component } from '@angular/core';
import { TabsComponent } from '../../todo-list/tabs/tabs.component';
import { SearchFormComponent } from '../../todo-list/search-form/search-form.component';
import { TodoItemComponent } from '../../todo-list/todo-item/todo-item.component';
import { TodoService } from '../../todo-list/todo.service';

@Component({
  selector: 'app-dummy-todos',
  imports: [TabsComponent, SearchFormComponent, TodoItemComponent],
  templateUrl: './dummy-todos.component.html',
  styleUrl: './dummy-todos.component.css'
})
export class DummyTodosComponent {

  todos: any[] = [];
  activeTab: string = 'todo';
  searchText: string = '';

  constructor(private todoService: TodoService) { }
  ngOnInit(): void {
    
    this.todoService.getDummyTodosFromBackend().subscribe({
      next: (todos) => {
        console.log('Todos:', todos);
        this.todos = todos.data;
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
}
