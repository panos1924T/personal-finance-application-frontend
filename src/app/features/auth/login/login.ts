import { Component } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {

    this.loginForm =
      this.fb.nonNullable.group({

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          Validators.required
        ]
      });
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(
        this.loginForm.getRawValue()
      )
      .subscribe({

        next: () => {

          this.notification.success(
            'Login successful.'
          );

          this.router.navigate([
            '/dashboard'
          ]);
        },

        error: error => {

          this.notification.apiError(
            error,
            'Invalid email or password.'
          );
        }
      });
  }
}