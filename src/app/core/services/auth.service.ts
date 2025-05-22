import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../features/auth/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiKey = environment.firebaseApiKey;
  private projectId = environment.firebaseProjectId;
  private authBaseUrl = environment.authBaseUrl;
  private databaseURL = environment.firestoreBaseUrl;
  private tokenExpirationTimer: any;

  // To tell the app when the auth status (User authenticated or not) is ready
  authReady = new BehaviorSubject<boolean>(false);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  

  constructor(private http: HttpClient, private router: Router) { }

  signUp(name: string, email: string, password: string): Observable<any> {
    const signupUrl = `${this.authBaseUrl}:signUp?key=${this.apiKey}`;

    return this.http.post<any>(signupUrl, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      switchMap((response) => {
        const userDocUrl = `${this.databaseURL}/${this.projectId}/databases/(default)/documents/users/${response.localId}`;
        const userDocBody = {
          fields: {
            uid: { stringValue: response.localId },
            name: { stringValue: name },
            email: { stringValue: email },
            createdAt: { timestampValue: new Date().toISOString() }
          }
        };
        const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);
        const user = new User(email, response.localId, response.idToken, expirationDate);
        this.userSubject.next(user);

        return this.http.patch(userDocUrl + `?key=${this.apiKey}`, userDocBody).pipe(
          tap(() => {
            this.userSubject.next(null);
          })
        )
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    const loginUrl = `${this.authBaseUrl}:signInWithPassword?key=${this.apiKey}`;

    return this.http.post<any>(loginUrl, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      switchMap((response) => {
        console.log('Login response:', response);
        const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);
        const user = new User(email, response.localId, response.idToken, expirationDate);
        this.userSubject.next(user);
        sessionStorage.setItem('userData', JSON.stringify(user));
        //usually an hour
        this.autoLogout(response.expiresIn * 1000);

        return of(response.localId);
      })
    );
  }

  logout() {
    this.userSubject.next(null);
    sessionStorage.removeItem('userData');
    this.router.navigateByUrl('/login', { replaceUrl: true });
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return;
    }

    const userDataString = sessionStorage.getItem('userData');
    if (!userDataString) {
      // No user data found, so render login page
      this.authReady.next(true);
      return;
    }

    const userData = JSON.parse(userDataString);

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      this.authReady.next(true);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

}
