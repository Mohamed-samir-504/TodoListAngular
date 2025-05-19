import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserCredential } from '@angular/fire/auth';

let authServiceMock: jasmine.SpyObj<AuthService>;
let routerMock: jasmine.SpyObj<Router>;

describe('LoginComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    let html: HTMLElement;

    beforeEach(async () => {
        // Create spy objects for the services
        authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['signUp']);
        routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, SignupComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        html = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have an invalid form when empty', () => {
        expect(component.signupForm.valid).toBeFalse();
    });

    it('should validate email and password fields', () => {
        component.signupForm.setValue({
            name: 'John Doe',
            email: 'invalid',
            passwords: {
                password: '123',
                confirmPassword: '123'
            }
        });
        expect(component.signupForm.valid).toBeFalse();

        component.signupForm.setValue({
            name: 'John Doe',
            email: 'test@example.com',
            passwords: {
                password: '123456',
                confirmPassword: '123456'
            }
        });
        expect(component.signupForm.valid).toBeTrue();
    });


    it('should call authService.signup and navigate to login on success', fakeAsync(() => {
        const mockUserCredential: Partial<UserCredential> = {
            user: { uid: '123ABC' } as any
        };

        authServiceMock.signUp.and.returnValue(of(mockUserCredential as UserCredential));

        component.signupForm.setValue({
            name: 'John Doe',
            email: 'test@example.com',
            passwords: {
                password: '123456',
                confirmPassword: '123456'
            }
        });
        component.onSubmit();

        expect(authServiceMock.signUp).toHaveBeenCalledWith('John Doe', 'test@example.com', '123456');
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should navigate to login page', () => {
        const loginButton = html.querySelector('.login-btn') as HTMLButtonElement;
        loginButton.click();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should display "Name is required." when name is empty and touched', () => {
        const nameControl = component.signupForm.get('name');
        nameControl?.markAsTouched();
        nameControl?.setValue('');
        fixture.detectChanges();

        const errorMessage = html.querySelector('.error small');
        expect(errorMessage?.textContent).toContain('Name is required.');
    });

    it('should display "Email is required." when email is empty and touched', () => {
        const emailControl = component.signupForm.get('email');
        emailControl?.markAsTouched();
        emailControl?.setValue('');
        fixture.detectChanges();

        const errorMessage = html.querySelector('.error small');
        expect(errorMessage?.textContent).toContain('Email is required.');
    });

    it('should display "Invalid email format." when email is invalid and touched', () => {
        const emailControl = component.signupForm.get('email');
        emailControl?.markAsTouched();
        emailControl?.setValue('invalid@');
        fixture.detectChanges();

        const errorMessage = html.querySelector('.error small');
        expect(errorMessage?.textContent).toContain('Invalid email format.');
    });

    it('should display "Password is required." when password is empty and touched', () => {
        const passwordControl = component.signupForm.get('passwords.password');
        passwordControl?.markAsTouched();
        passwordControl?.setValue('');
        fixture.detectChanges();

        const errorMessage = html.querySelector('.error small');
        expect(errorMessage?.textContent).toContain('Password is required.');
    });

    it('should display "Minimum 6 characters." when password is too short and touched', () => {
        const passwordControl = component.signupForm.get('passwords.password');
        passwordControl?.markAsTouched();
        passwordControl?.setValue('123');
        fixture.detectChanges();

        const errorMessage = html.querySelector('.error small');
        expect(errorMessage?.textContent).toContain('Minimum 6 characters.');
    });

    it('should display "Passwords do not match." when confirmPassword does not match password', () => {
        const passwordGroup = component.signupForm.get('passwords');
        passwordGroup?.get('password')?.setValue('123456');
        passwordGroup?.get('confirmPassword')?.setValue('123457');
        passwordGroup?.get('confirmPassword')?.markAsTouched();

        fixture.detectChanges();

        const errorMessage = html.querySelector('.error small');
        expect(errorMessage?.textContent).toContain('Passwords do not match.');
    });


})
