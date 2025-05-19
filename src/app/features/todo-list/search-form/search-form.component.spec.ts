import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { FormsModule } from '@angular/forms';

describe('AddFormComponent', () => {
    let component: SearchFormComponent;
    let fixture: ComponentFixture<SearchFormComponent>;
    let html: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule,SearchFormComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchFormComponent);
        component = fixture.componentInstance;
        html = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit add event when both fields are filled', () => {
        spyOn(component.searchedText, 'emit');

        component.searchText = 'Test Text';
        

        component.onSearch();

        expect(component.searchedText.emit).toHaveBeenCalledWith('Test Text');
    });

});