import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(public modalService: ModalService,public authService:AuthService,private auth:AngularFireAuth) {}

  ngOnInit(): void {}

  openModal(event: Event) {
    event.preventDefault();
    this.modalService.toggleModal('auth');
  }
logout($event:Event){
$event.preventDefault()
this.auth.signOut()
}
}
