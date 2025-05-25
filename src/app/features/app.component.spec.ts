import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from '../core/services/auth.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  
  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['autoLogin']);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'TodoListAngular' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('TodoListAngular');
  });

  it('should call authService.autoLogin on ngOnInit', () => {
    component.ngOnInit();
    expect(authServiceMock.autoLogin).toHaveBeenCalled();
  });

});

