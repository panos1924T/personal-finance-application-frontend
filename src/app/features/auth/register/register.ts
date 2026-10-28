import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : {passwordMismatch: true};
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.registerForm = this.fb.nonNullable.group(
      {
        email: ['', [Validators.required, Validators.email]],
        displayName: ['', 
          [Validators.required,
           Validators.minLength(3),
           Validators.maxLength(20) 
          ]
        ],
        password: ['', [Validators.required,
          Validators.pattern(
          /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,}$/
          )]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: passwordsMatchValidator
      }
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();

    const request = {
      email: formValue.email,
      displayName: formValue.displayName,
      password: formValue.password
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.notification.success('Account created successfully.');
        void this.router.navigate(['/login']);
      },
      error: error => {
        this.notification.apiError(
          error,
          'Could not create your account.'
        );
      }
    });
  }
}
