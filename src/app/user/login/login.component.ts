import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AngularFireAuth) {}
  isSubmission=false
  showAlert = false;
  alertColor = 'blue';
  alertMsg = '';

  ngOnInit(): void {}

  credentials = {
    email: '',
    password: '',
  };

  async login() {
this.isSubmission=true
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait..! You are connecting to the server';
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
this.isSubmission=false
      this.alertColor = 'red';
      this.alertMsg = 'Oops..! Login failed...please enter valid Credentials';
      return;
    }
    this.alertColor = 'green';
    this.alertMsg = 'Yeeeeah.....Your are successfully LoggedIn...!';
  }
}
