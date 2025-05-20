import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { ActivatedRoute } from '@angular/router';

describe('TodoListComponent', () => {
    let component: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;
    let todoServiceMock: jasmine.SpyObj<TodoService>;

    const mockTodos = [
        {
            id: '1',
            title: 'Task A',
            description: 'Task A description',
            userId: 'u1', status: 'todo',
            priority: false,
            timestamp: { toDate: () => new Date() }
        },

        {
            id: '2',
            title: 'Task B',
            description: 'Task B description',
            userId: 'u1', status: 'completed',
            priority: false,
            timestamp: { toDate: () => new Date() }
        },
        {
            id: '3',
            title: 'Task C',
            description: 'Task C description',
            userId: 'u1', status: 'todo',
            priority: true,
            timestamp: { toDate: () => new Date() }
        }
    ];

    beforeEach(async () => {
        todoServiceMock = jasmine.createSpyObj<TodoService>('TodoService', [
            'getTodos',
            'addTodo',
            'deleteTodo',
            'updateStatus',
            'updatePriority'
        ]);

        todoServiceMock.getTodos.and.returnValue(of(mockTodos));

        await TestBed.configureTestingModule({
            imports: [TodoListComponent],
            providers: [
                { provide: TodoService, useValue: todoServiceMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => 'u1' //This simulates route.snapshot.paramMap.get('userId')
                            }
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch todos on init', () => {
        expect(component.todos.length).toBe(3);
    });

    it('should read userId from route on init', () => {
        expect(component.userId).toBe('u1');
    });

    it('should filter todos by userId and tab', () => {
        component.activeTab = 'todo';
        component.searchText = '';
        const filtered = component.filteredTodos;
        expect(filtered.length).toBe(1);
        expect(filtered[0].status).toBe('todo');
    });

    it('should filter todos by search text', () => {
        component.activeTab = 'todo';
        component.searchText = 'task a';
        const filtered = component.filteredTodos;
        expect(filtered.length).toBe(1);
        expect(filtered[0].title).toContain('Task A');
    });

    it('should add todo via service', () => {
        todoServiceMock.addTodo.and.returnValue(of({}));
        component.onAddTodo({ title: 'New Task', description: 'Desc' });
        expect(todoServiceMock.addTodo).toHaveBeenCalledWith('New Task', 'Desc', 'user1');
    });

    it('should delete todo and update list', () => {
        todoServiceMock.deleteTodo.and.returnValue(of());
        component.onDeleteTodo('1');
        expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith('1');
    });

    it('should complete todo and update status', () => {
        todoServiceMock.updateStatus.and.returnValue(of());
        component.onCompleteTodo('1');
        expect(todoServiceMock.updateStatus).toHaveBeenCalledWith('1', 'completed');
        expect(component.todos.find(t => t.id === '1')?.status).toBe('completed');
    });

    it('should toggle priority and update todo', () => {
        todoServiceMock.updatePriority.and.returnValue(of());
        const originalPriority = component.todos[0].priority;
        component.onTogglePriority('1');
        expect(todoServiceMock.updatePriority).toHaveBeenCalledWith('1', originalPriority ? false : true);
        expect(component.todos[0].priority).toBe(originalPriority ? 0 : 1);
    });

    it('should switch active tab', () => {
        component.onSwitchTab('completed');
        expect(component.activeTab).toBe('completed');
    });

    it('should update searchText on input', () => {
        component.onSearchInput('abc');
        expect(component.searchText).toBe('abc');
    });

    it('should unsubscribe on destroy', () => {
        const unsubscribeSpy = spyOn(component['todosSub'], 'unsubscribe');
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should log error when getTodos fails', () => {
        const error = { message: 'Failed' };
        todoServiceMock.getTodos.and.returnValue(throwError(() => error));
        spyOn(console, 'error');

        const testFixture = TestBed.createComponent(TodoListComponent);
        testFixture.detectChanges();

        expect(console.error).toHaveBeenCalledWith('Error fetching todos:', error);
    });
});
