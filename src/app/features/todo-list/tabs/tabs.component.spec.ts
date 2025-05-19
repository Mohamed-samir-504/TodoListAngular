import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
    let component: TabsComponent;
    let fixture: ComponentFixture<TabsComponent>;
    let html: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TabsComponent);
        component = fixture.componentInstance;
        html = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit "completed" and update activeTab when switchTab is called with "completed"', () => {
        spyOn(component.selectedTab, 'emit');

        component.switchTab('completed');

        expect(component.activeTab).toBe('completed');
        expect(component.selectedTab.emit).toHaveBeenCalledWith('completed');
    });

    it('should emit "todo" and update activeTab when switchTab is called with "todo"', () => {
        spyOn(component.selectedTab, 'emit');

        component.switchTab('todo');

        expect(component.activeTab).toBe('todo');
        expect(component.selectedTab.emit).toHaveBeenCalledWith('todo');
    });

    it('should call switchTab when "Todo" button is clicked', () => {
        spyOn(component, 'switchTab');
        const todoButton = html.querySelector('button:nth-child(1)') as HTMLButtonElement;
        todoButton.click();
        expect(component.switchTab).toHaveBeenCalledWith('todo');
    });

    it('should call switchTab when "Completed" button is clicked', () => {
        spyOn(component, 'switchTab');
        const todoButton = html.querySelector('button:nth-child(2)') as HTMLButtonElement;
        todoButton.click();
        expect(component.switchTab).toHaveBeenCalledWith('completed');
        
    });

});