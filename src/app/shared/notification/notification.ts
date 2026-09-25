import { Component } from '@angular/core';
import { NotificationService } from '../../core/services/notification';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification {

  constructor(
    public notificationService:
      NotificationService
  ) {}
}