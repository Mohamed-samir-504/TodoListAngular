import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, user => {
      this.userSubject.next(user);
    });
  }

  
  signUp(name: string, email: string, password: string): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then((cred) => {
        const uid = cred.user.uid;

        const userDoc = doc(this.firestore, 'users', uid);
        return setDoc(userDoc, {
          uid,
          name,
          email,
          createdAt: serverTimestamp()
        }).then(() => cred);
      })
    );
  }


  login(email: string, password: string): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }
}