import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { type todoItem } from './todo-item.model';

describe('TodoItemComponent', () => {
    let component: TodoItemComponent;
    let fixture: ComponentFixture<TodoItemComponent>;
    let html: HTMLElement;

    const mockTodo: todoItem = {
        id: '1',
        title: 'Test Todo',
        description: 'This is a test todo item',
        status: 'todo',
        priority: true
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoItemComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoItemComponent);
        component = fixture.componentInstance;
        html = fixture.nativeElement;
        component.todo = mockTodo; // Set @Input()
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit delete event with todo id when onDelete is called', () => {
        spyOn(component.delete, 'emit');

        component.onDelete();

        expect(component.delete.emit).toHaveBeenCalledWith('1');
    });

    it('should emit complete event with todo id when onComplete is called', () => {
        spyOn(component.complete, 'emit');

        component.onComplete();

        expect(component.complete.emit).toHaveBeenCalledWith('1');
    });

    it('should emit togglePriority event with todo id when onTogglePriority is called', () => {
        spyOn(component.togglePriority, 'emit');

        component.onTogglePriority();

        expect(component.togglePriority.emit).toHaveBeenCalledWith('1');
    });

    it('should emit complete when complete button is clicked', () => {
        spyOn(component, 'onComplete');
        const button = html.querySelector('.fa-check') as HTMLButtonElement;
        button.click();
        expect(component.onComplete).toHaveBeenCalled();
    });

    it('should emit togglePriority when togglePriority button is clicked', () => {
        spyOn(component, 'onTogglePriority');
        const button = html.querySelector('.fa-circle-up') as HTMLButtonElement;
        button.click();
        expect(component.onTogglePriority).toHaveBeenCalled();
    });


});
