import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiKey = environment.firebaseApiKey;
  private projectId = environment.firebaseProjectId;
  private authBaseUrl = environment.authBaseUrl;
  private databaseURL = environment.firestoreBaseUrl;
  private userSubject = new BehaviorSubject<User|null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

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
        return this.http.patch(userDocUrl + `?key=${this.apiKey}`, userDocBody)
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
        const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
        const user = new User(response.email, response.localId, response.idToken, expirationDate);
        this.userSubject.next(user);
        return of(user);
      })
    );
  }

  logout() {
    this.userSubject.next(null);
  }
}
