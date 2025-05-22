// import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
// import { AuthService } from './auth.service';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
// import { Router } from '@angular/router';
// import { environment } from '../../../environments/environment';
// import { take } from 'rxjs/operators';
// import { tokenInterceptor } from '../interceptors/auth-interceptor';

// describe('AuthService', () => {
//     let service: AuthService;
//     let testingController: HttpTestingController;
//     let routerMock: jasmine.SpyObj<Router>;
//     let fixture: ComponentFixture<AuthService>;

//     beforeEach(() => {
//         routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

//         TestBed.configureTestingModule({
//             providers: [AuthService,
//                 provideHttpClientTesting(), provideHttpClient(withInterceptors([tokenInterceptor])),
//                 { provide: Router, useValue: routerMock }
//             ],
//         });
//         service = TestBed.inject(AuthService);
//         testingController = TestBed.inject(HttpTestingController);
//         sessionStorage.clear();
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     // it('should make a POST request on login', () => {
//     //     const mockResponse = "123ABC";

//     //     service.login('test@example.com', '123456').subscribe(userId => {
//     //         expect(userId).toBe('123ABC');
//     //     });


//     //     const req = testingController.expectOne(req =>
//     //         req.url.includes('signInWithPassword')
//     //     );
//     //     expect(req.request.method).toBe('POST');


//     //     // req.flush(mockResponse);
//     // });
//     // const mockResponse = {
//     //         displayName: "",
//     //         email:"m@example.com",
//     //         expiresIn:"3600",
//     //         idToken:"fake_token",
//     //         kind:"identitytoolkit#VerifyPasswordResponse",
//     //         localId:"d3O6ilvQkuPRlGM3txKFNf65oi23",
//     //         refreshToken:"fake_refresh",
//     //         registered:true
//     //     };



//     afterEach(() => {
//         testingController.verify();
//     });

//     it('should send login request and update auth state', (done) =>{
//         const mockResponse = {
//       kind: "identitytoolkit#VerifyPasswordResponse",
//       localId: "abc123",
//       email: "m@example.com",
//       displayName: "",
//       idToken: "ey...mock",
//       expiresIn: "3600",
//       refreshToken: "some-token",
//       registered: true
//     };

//         const email = 'test@example.com';
//         const password = 'password123';

//         //spyOn(service['userSubject'], 'next').and.callThrough();
//         spyOn(service, 'autoLogout');
//         spyOn(sessionStorage, 'setItem');


//         service.login(email, password).subscribe({
//       next: (id) => {
//         expect(id).toBe('abc123');
//         done();

//       },
//       error: err => {
//         console.error('Unexpected error in test:', err);
//         fail(err.message);
//         done();

//       }
//     });



//         // const allRequests = testingController.match(() => true);
//         // console.log('Requests made:', allRequests.map(r => r.request.urlWithParams));

//         const expectedUrl = `${environment.authBaseUrl}:signInWithPassword?key=${environment.firebaseApiKey}`;
//         const req = testingController.expectOne(expectedUrl);
//         expect(req.request.method).toBe('POST');
//         expect(req.request.body).toEqual({
//             email,
//             password,
//             returnSecureToken: true
//         });

//         req.flush(mockResponse);
//     });

// });

import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { tokenInterceptor } from '../interceptors/auth-interceptor';

describe('AuthService with interceptor', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(() => {
        routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([tokenInterceptor])),
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
});
