import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

describe('TodoListComponent', () => {
    let component: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;
    let todoServiceMock: jasmine.SpyObj<TodoService>;
    let authServiceMock: jasmine.SpyObj<AuthService>;

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

        // Because TodoListComponent imports Logout component that uses AuthService
        authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
        await TestBed.configureTestingModule({
            imports: [TodoListComponent],
            providers: [
                { provide: TodoService, useValue: todoServiceMock },
                { provide: AuthService, useValue: authServiceMock },
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
        todoServiceMock.getTodos.and.returnValue(of(mockTodos));
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
        expect(filtered.length).toBe(2);
        expect(filtered[0].status).toBe('todo');
    });

    it('should filter todos by search text', () => {
        component.activeTab = 'todo';
        component.searchText = 'c';
        const filtered = component.filteredTodos;
        expect(filtered.length).toBe(1);
        expect(filtered[0].title).toContain('Task C');
    });


    it('should call addTodo on the service with correct parameters', () => {
        todoServiceMock.addTodo.and.returnValue(of({}));
        component.onAddTodo({ title: 'New Task', description: 'Desc' });
        expect(todoServiceMock.addTodo).toHaveBeenCalledWith('New Task', 'Desc', 'u1');
    });

    it('should call deleteTodo on the service with correct parameters', () => {
        todoServiceMock.deleteTodo.and.returnValue(of({}));
        component.onDeleteTodo('1');
        expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith('1');

    });

    it('should call updateStatus on the service with correct parameters', () => {
        todoServiceMock.updateStatus.and.returnValue(of({}));
        component.onCompleteTodo('1');
        expect(todoServiceMock.updateStatus).toHaveBeenCalledWith('1', 'completed');

    });

    it('should call updatePriority on the service with correct parameters', () => {
        todoServiceMock.updatePriority.and.returnValue(of({}));
        const newPriority = !component.todos[0].priority;
        component.onTogglePriority('1');
        expect(todoServiceMock.updatePriority).toHaveBeenCalledWith('1', newPriority);
    });


    it('should switch active tab', () => {
        component.onSwitchTab('completed');
        expect(component.activeTab).toBe('completed');
    });

    it('should update searchText on input', () => {
        component.onSearchInput('abc');
        expect(component.searchText).toBe('abc');
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
