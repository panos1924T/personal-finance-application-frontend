import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { Navbar } from './shared/navbar/navbar';
import { Notification } from './shared/notification/notification';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Notification
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private router = inject(Router);

  showNavbar = signal(
    this.router.url.split('?')[0] !== '/login'
  );

  constructor() {

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(event => {

        const path =
          event.urlAfterRedirects
            .split('?')[0];

        this.showNavbar.set(
          path !== '/login'
        );
      });
  }
}