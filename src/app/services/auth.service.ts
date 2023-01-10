import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.modal';
import { Observable } from 'rxjs';
import { map,delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>;
  isAuthenticated$: Observable<boolean>;
isAuthenticatedWithDelay$:Observable<boolean>

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.userCollection = this.db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(delay(1000))
  }
  public async createUser(userData: IUser) {
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string,
      userData.password as string
    );

    await this.userCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      age: userData.age,
    });
    await userCred.user?.updateProfile({ displayName: userData.name });
  }
}
