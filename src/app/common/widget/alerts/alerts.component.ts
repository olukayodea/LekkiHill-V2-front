import { Component, Input, OnInit } from '@angular/core';
import { NotificationData } from 'src/app/_models/patients';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  @Input() data: NotificationData;
  
  constructor() { }

  ngOnInit(): void {
  }

}
