import { Injectable } from '@angular/core';
import { AsyncValidator } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
providedIn:'root'
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) {}

  validate=(control: AbstractControl): Promise< ValidationErrors| null > =>{
    return this.auth.fetchSignInMethodsForEmail(control.value).then((res) => {
      return res.length ? { emailTaken: true } : null;
    });
  }
}
