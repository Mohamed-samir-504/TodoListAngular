import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../features/auth/user.model';

describe('AuthService with interceptor', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(() => {
        routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthService,
                { provide: Router, useValue: routerMock }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        sessionStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should login a user and return user local id', fakeAsync(() => {

        const email = 'test@example.com';
        const password = '123456';

        const mockResponse = {
            localId: "abc123",
            expiresIn: "3600",
        };

        spyOn(service['userSubject'], 'next')
        spyOn(service, 'autoLogout');
        spyOn(sessionStorage, 'setItem');

        service.login(email, password).subscribe(userId => {
            expect(userId).toBe('abc123');
            expect(service['userSubject'].next).toHaveBeenCalled();
            expect(sessionStorage.setItem).toHaveBeenCalled();
            expect(service.autoLogout).toHaveBeenCalledWith(3600 * 1000);
        });

        const expectedUrl = `${environment.authBaseUrl}:signInWithPassword?key=${environment.firebaseApiKey}`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            email,
            password,
            returnSecureToken: true
        });

        // The observable of POST method resolves so switchmap is called
        req.flush(mockResponse);
    }));

    it('should sign up a user and create Firestore doc', fakeAsync(() => {

        const name = 'Test User';
        const email = 'test@example.com';
        const password = '123456';

        const mockResponse = {
            localId: "abc123",
        };

        spyOn(service['userSubject'], 'next').and.callThrough();

        service.signUp(name, email, password).subscribe(() => {
            expect(service['userSubject'].next).toHaveBeenCalled();
        });

        const expectedUrl = `${environment.authBaseUrl}:signUp?key=${environment.firebaseApiKey}`;
        const postReq = httpMock.expectOne(expectedUrl);
        expect(postReq.request.method).toBe('POST');
        expect(postReq.request.body).toEqual({
            email,
            password,
            returnSecureToken: true
        });
        // The observable of POST method resolves so switchmap is called which calls a PATCH request
        postReq.flush(mockResponse);

        const userDocUrl = `${environment.firestoreBaseUrl}/${environment.firebaseProjectId}/databases/(default)/documents/users/${mockResponse.localId}?key=${environment.firebaseApiKey}`;
        const patchReq = httpMock.expectOne(userDocUrl);
        expect(patchReq.request.method).toBe('PATCH');

        const body = patchReq.request.body;
        expect(body.fields.uid.stringValue).toBe(mockResponse.localId);
        expect(body.fields.name.stringValue).toBe(name);
        expect(body.fields.email.stringValue).toBe(email);

        patchReq.flush({});
    }));

    it('should logout and reset timer and session storage', () => {

        spyOn(service['userSubject'], 'next')
        spyOn(sessionStorage, 'removeItem');

        service.logout();
        expect(service['userSubject'].next).toHaveBeenCalledWith(null);
        expect(sessionStorage.removeItem).toHaveBeenCalled();
        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login', { replaceUrl: true });
        expect(service['tokenExpirationTimer']).toBe(null);

    });

    it('should call autoLogin and do nothing if sessionStorage has no userData', () => {
        spyOn(service['authReady'], 'next');
        spyOn(service['userSubject'], 'next');
        service.autoLogin();
        expect(service['authReady'].next).toHaveBeenCalledWith(true);
        expect(service['userSubject'].next).not.toHaveBeenCalled();

    });

    it('should call autoLogin and restore user and call autoLogout if userData exists', fakeAsync(() => {
        const expirationDate = new Date(Date.now() + 3600 * 1000);
        const mockUser = new User(
            'test@example.com',
            'userId123',
            'token123',
            expirationDate
        );

        sessionStorage.setItem('userData', JSON.stringify(mockUser));

        spyOn(service['userSubject'], 'next');
        spyOn(service['authReady'], 'next');
        spyOn(service, 'autoLogout');

        service.autoLogin();

        expect(service['userSubject'].next).toHaveBeenCalled();
        expect(service['authReady'].next).toHaveBeenCalledWith(true);
        expect(service.autoLogout).toHaveBeenCalled();


    }));

    it('should call logout after expirationDuration', fakeAsync(() => {
    const logoutSpy = spyOn(service, 'logout');

    const expiration = 5000; // 5 seconds
    service.autoLogout(expiration);

    // logout should NOT have been called yet
    expect(logoutSpy).not.toHaveBeenCalled();

    // Advance virtual time by 5 seconds
    tick(expiration);

    expect(logoutSpy).toHaveBeenCalled();
  }));

});
