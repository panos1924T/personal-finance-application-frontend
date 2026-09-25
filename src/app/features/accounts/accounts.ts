import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Account, AccountUpdate } from '../../models/account';
import { AccountService } from '../../core/services/account';
import { AccountForm } from './account-form/account-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounts',
  imports: [AccountForm, FormsModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts implements OnInit {

  accounts: Account[] = [];

  editingAccountUuid: string | null = null;
  editName = '';
  editBalance = 0;

  readonly accountTypes: Account['accountType'][] = [
    'LIQUIDITY',
    'SAVINGS',
    'INVESTMENT',
    'CREDIT'
  ];

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe({
      next: response => {
        this.accounts = response.content;
      },
      error: error => {
        console.error('Failed to load accounts', error);
      }
    });
  }

  onAccountCreated(account: Account): void {
    this.accounts = [...this.accounts, account];
    this.cdr.detectChanges();
  }

  startEdit(account: Account): void {
    this.editingAccountUuid = account.uuid;
    this.editName = account.name;
    this.editBalance = account.balance;
  }

  cancelEdit(): void {
    this.editingAccountUuid = null;
  }

  saveEdit(account: Account): void {
    const updatedAccount: AccountUpdate = {
      name: this.editName,
      balance: this.editBalance
    };

    this.accountService
      .updateAccount(account.uuid, updatedAccount)
      .subscribe({
        next: updated => {
          this.accounts = this.accounts.map(existing =>
            existing.uuid === updated.uuid ? updated : existing
          );

          this.editingAccountUuid = null;

          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Failed to update account', error);
        }
      });
  }

  onDeleteAccount(uuid: string): void {
    this.accountService.deleteAccount(uuid).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(
          account => account.uuid !== uuid
        );

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to delete account', error);
      }
    });
  }

  getAccountsByType(type: Account['accountType']): Account[] {
    return this.accounts.filter(
      account => account.accountType === type
    );
  }
}