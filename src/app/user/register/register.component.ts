import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import Iuser from '../../models/user.modal';
import { RegisterValidator } from "../../validtors/register";
import{EmailTaken}from"../../validtors/email-taken"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService,private EmailTaken:EmailTaken) {}
  showAlert = false;
  alertMsg = 'Please Wait! Your accont has been Created.';
  alertColor = 'blue';

  inSubmission = false;

  ngOnInit(): void {}
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email],[this.EmailTaken.validate]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  registerForm = new FormGroup({
    name: this.name,
    age: this.age,
    email: this.email,
    phoneNumber: this.phoneNumber,
    password: this.password,
    confirmPassword: this.confirmPassword,
  },[RegisterValidator.match('password','confirmPassword')]);

  async register() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account has been Created.';
    this.alertColor = 'blue';

    const { email, password } = this.registerForm.value;

    try {
      await this.authService.createUser(this.registerForm.value as Iuser);
    } catch (error) {
      this.alertColor = 'red';
      this.alertMsg = 'An unexpected error occured. Please try again';

      this.inSubmission = false;
      return;
    }
    this.alertColor = 'green';
    this.alertMsg = 'Success..! Account successfully registered...';
  }
}
