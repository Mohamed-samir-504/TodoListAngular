import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

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
}