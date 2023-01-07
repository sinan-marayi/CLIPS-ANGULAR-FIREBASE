import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log(this.color);

  }
  @Input() color = '';

  get bgColor() {
    return `bg-${this.color}-400`;
  }
}
