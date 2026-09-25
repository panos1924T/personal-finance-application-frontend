import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Account,
  AccountUpdate
} from '../../models/account';

import { AccountService } from '../../core/services/account';
import { NotificationService } from '../../core/services/notification';

import { AccountForm } from './account-form/account-form';

@Component({
  selector: 'app-accounts',
  imports: [
    AccountForm,
    FormsModule
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts implements OnInit {

  accounts =
    signal<Account[]>([]);

  editingAccountUuid:
    string | null = null;

  editName = '';
  editBalance = 0;

  readonly accountTypes:
    Account['accountType'][] = [
      'LIQUIDITY',
      'SAVINGS',
      'INVESTMENT',
      'CREDIT'
    ];

  constructor(
    private accountService: AccountService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {

    this.accountService
      .getAccounts()
      .subscribe({

        next: response => {

          this.accounts.set(
            response.content
          );
        },

        error: error => {

          this.notification.apiError(
            error,
            'Failed to load accounts.'
          );
        }
      });
  }

  onAccountCreated(
    account: Account
  ): void {

    this.accounts.update(
      accounts => [
        ...accounts,
        account
      ]
    );
  }

  startEdit(
    account: Account
  ): void {

    this.editingAccountUuid =
      account.uuid;

    this.editName =
      account.name;

    this.editBalance =
      account.balance;
  }

  cancelEdit(): void {
    this.editingAccountUuid = null;
  }

  saveEdit(
    account: Account
  ): void {

    const updatedAccount:
      AccountUpdate = {

      name:
        this.editName,

      balance:
        this.editBalance
    };

    this.accountService
      .updateAccount(
        account.uuid,
        updatedAccount
      )
      .subscribe({

        next: updated => {

          this.accounts.update(
            accounts =>
              accounts.map(
                existing =>
                  existing.uuid ===
                  updated.uuid
                    ? updated
                    : existing
              )
          );

          this.editingAccountUuid =
            null;

          this.notification.success(
            'Account updated successfully.'
          );
        },

        error: error => {

          this.notification.apiError(
            error,
            'Failed to update account.'
          );
        }
      });
  }

  onDeleteAccount(
    uuid: string
  ): void {

    const confirmed =
      window.confirm(
        'Delete this account?'
      );

    if (!confirmed) {
      return;
    }

    this.accountService
      .deleteAccount(uuid)
      .subscribe({

        next: () => {

          this.accounts.update(
            accounts =>
              accounts.filter(
                account =>
                  account.uuid !== uuid
              )
          );

          this.notification.success(
            'Account deleted successfully.'
          );
        },

        error: error => {

          this.notification.apiError(
            error,
            'Failed to delete account.'
          );
        }
      });
  }

  getAccountsByType(
    type: Account['accountType']
  ): Account[] {

    return this.accounts().filter(
      account =>
        account.accountType === type
    );
  }
}