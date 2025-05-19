import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFormComponent } from './add-form.component';
import { FormsModule } from '@angular/forms';

describe('AddFormComponent', () => {
    let component: AddFormComponent;
    let fixture: ComponentFixture<AddFormComponent>;
    let html: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule,AddFormComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AddFormComponent);
        component = fixture.componentInstance;
        html = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit add event when both fields are filled', () => {
        spyOn(component.add, 'emit');

        component.title = 'Test Title';
        component.description = 'Test Description';

        component.onAdd();

        expect(component.add.emit).toHaveBeenCalledWith({
            title: 'Test Title',
            description: 'Test Description'
        });
    });

    it('should alert and not emit when fields are empty', () => {
        spyOn(window, 'alert');
        spyOn(component.add, 'emit');

        component.title = '';
        component.description = '';

        component.onAdd();

        expect(window.alert).toHaveBeenCalledWith('Please fill in both title and description.');
        expect(component.add.emit).not.toHaveBeenCalled();
    });

    it('should alert if only one field is filled', () => {
        spyOn(window, 'alert');
        spyOn(component.add, 'emit');

        component.title = 'Only Title';
        component.description = '';

        component.onAdd();

        expect(window.alert).toHaveBeenCalledWith('Please fill in both title and description.');
        expect(component.add.emit).not.toHaveBeenCalled();
    });
});