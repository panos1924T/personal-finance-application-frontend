import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account';
import { Account, AccountCreate } from '../../../models/account';

@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css'
})
export class AccountForm {

  @Output() accountCreated = new EventEmitter<Account>();

  accountForm;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {
    this.accountForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      accountType: [
        'LIQUIDITY' as AccountCreate['accountType'],
        Validators.required
      ],
      initialBalance: [0, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      return;
    }

    this.accountService
      .createAccount(this.accountForm.getRawValue())
      .subscribe({
        next: account => {
          this.accountCreated.emit(account);

          this.accountForm.reset({
            name: '',
            accountType: 'LIQUIDITY',
            initialBalance: 0
          });
        },
        error: error => {
          console.error('Failed to create account', error);
        }
      });
  }
}