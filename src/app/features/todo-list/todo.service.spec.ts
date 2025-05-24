import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../features/auth/user.model';

describe('TodoService', () => {
    let service: TodoService;
    let httpMock: HttpTestingController;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(() => {
        routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                TodoService,
                { provide: Router, useValue: routerMock }
            ]
        });

        service = TestBed.inject(TodoService);
        httpMock = TestBed.inject(HttpTestingController);
        sessionStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch todos for user and return structured array', () => {
        const userId = 'user123';

        const mockFirestoreResponse = [
            {
                document: {
                    name: `projects/${environment.firebaseProjectId}/databases/(default)/documents/todo-items/abc123`,
                    fields: {
                        title: { stringValue: 'Test Todo' },
                        description: { stringValue: 'Test Description' },
                        status: { stringValue: 'pending' },
                        priority: { booleanValue: true },
                        userId: { stringValue: 'user123' },
                        timestamp: { timestampValue: '2024-01-01T12:00:00.000Z' }
                    }
                }
            }
        ];

        const body = {
            structuredQuery: {
                from: [{ collectionId: 'todo-items' }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: 'userId' },
                        op: 'EQUAL',
                        value: { stringValue: userId }
                    }
                }
            }
        };

        service.getTodos(userId).subscribe(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].id).toBe('abc123');
            expect(todos[0].title).toBe('Test Todo');
            expect(todos[0].priority).toBeTrue();
            expect(todos[0].timestamp instanceof Date).toBeTrue();
        });

        const expectedUrl = `${environment.firestoreBaseUrl}/${environment.firebaseProjectId}/databases/(default)/documents:runQuery?key=${environment.firebaseApiKey}`;
        const req = httpMock.expectOne(expectedUrl);

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(body)
        req.flush(mockFirestoreResponse);
    });

    it('should send a POST request to add a new todo', () => {
        const title = 'Test Task';
        const description = 'Test Description';
        const userId = 'user123';

        const mockFirestoreResponse = {
            name: `projects/${environment.firebaseProjectId}/databases/(default)/documents/todo-items/user123`,
            fields: {
                title: { stringValue: "Test Task" },
                description: { stringValue: "Test Description" },
                status: { stringValue: "todo" },
                priority: { booleanValue: false },
                userId: { stringValue: "user123" },
                timestamp: { timestampValue: "2024-05-22T18:12:47.299Z" }
            },
        };

        service.addTodo(title, description, userId).subscribe(response => {
            expect(response).toEqual(mockFirestoreResponse);
        });

        const expectedUrl = `${service['baseUrl']}?key=${environment.firebaseApiKey}`;
        const req = httpMock.expectOne(expectedUrl);

        expect(req.request.method).toBe('POST');

        const body = req.request.body.fields;
        expect(body.title.stringValue).toBe(title);
        expect(body.description.stringValue).toBe(description);
        expect(body.status.stringValue).toBe('todo');
        expect(body.priority.booleanValue).toBeFalse();
        expect(body.userId.stringValue).toBe(userId);


        req.flush(mockFirestoreResponse);
    });

    it('should send DELETE request to remove a todo', () => {
        const todoId = 'abc123';

        service.deleteTodo(todoId).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const expectedUrl = `${service['baseUrl']}/${todoId}?key=${environment.firebaseApiKey}`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('DELETE');

        req.flush({});
    });

    it('should send PATCH request to update todo status', () => {
        const todoId = 'abc123';
        const status = 'completed';

        service.updateStatus(todoId, status).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const expectedUrl = `${service['baseUrl']}/${todoId}?key=${environment.firebaseApiKey}&updateMask.fieldPaths=status`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body.fields.status.stringValue).toBe(status);

        req.flush({});
    });

    it('should send PATCH request to update todo priority', () => {
        const todoId = 'abc123';
        const priority = true;

        service.updatePriority(todoId, priority).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const expectedUrl = `${service['baseUrl']}/${todoId}?key=${environment.firebaseApiKey}&updateMask.fieldPaths=priority`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body.fields.priority.booleanValue).toBe(priority);

        req.flush({}); 
    });
})