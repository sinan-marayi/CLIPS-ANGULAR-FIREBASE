import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor() {}
showAlert=false
alertMsg='Please Wait! Your accont has been Created.'
alertColor='blue'

  ngOnInit(): void {}
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  phoneNumber = new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]);
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
  });

register(){
this.showAlert=true;
this.alertMsg="Please wait! Your account has been Created."
this.alertColor='blue'
}
}
