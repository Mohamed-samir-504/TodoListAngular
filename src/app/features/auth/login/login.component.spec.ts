import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserCredential } from '@angular/fire/auth';

let authServiceMock: jasmine.SpyObj<AuthService>;
let routerMock: jasmine.SpyObj<Router>;

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let html: HTMLElement;

    beforeEach(async () => {
        // Create spy objects for the services
        authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
        routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, LoginComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        html = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have an invalid form when empty', () => {
        expect(component.loginForm.valid).toBeFalse();
    });

    it('should validate email and password fields', () => {
        component.loginForm.setValue({ email: 'invalid', password: '123' });
        expect(component.loginForm.valid).toBeFalse();

        component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
        expect(component.loginForm.valid).toBeTrue();
    });

    it('should call authService.login and navigate on success', fakeAsync(() => {
        const mockUserCredential: Partial<UserCredential> = {
            user: { uid: '123ABC' } as any
        };

        authServiceMock.login.and.returnValue(of(mockUserCredential as UserCredential));

        component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
        component.onSubmit();

        expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(routerMock.navigate).toHaveBeenCalledWith(['/user', '123ABC', 'todos']);
    }));

    it('should show error on failed login', fakeAsync(() => {
        spyOn(window, 'alert');
        authServiceMock.login.and.returnValue(throwError(() => ({ message: 'Invalid credentials' })));

        component.loginForm.setValue({ email: 'fail@example.com', password: 'wrongpass' });
        component.onSubmit();

        expect(authServiceMock.login).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Login failed. Please check your credentials.');
    }));

    it('should navigate to signup page', () => {
        const signupButton = html.querySelector('.signup-btn') as HTMLButtonElement;
        signupButton.click();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/signup']);
    });
});