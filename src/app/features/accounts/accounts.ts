import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account';
import { AccountService } from '../../core/services/account';
import { AccountForm } from './account-form/account-form';

@Component({
  selector: 'app-accounts',
  imports: [AccountForm],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts implements OnInit {

  accounts: Account[] = [];

  readonly accountTypes: Account['accountType'][] = [
    'LIQUIDITY',
    'SAVINGS',
    'INVESTMENT',
    'CREDIT'
  ];

  constructor(private accountService: AccountService) {}

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
    this.accounts.push(account);
  }

  onDeleteAccount(uuid: string): void {
    this.accountService.deleteAccount(uuid).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(
          account => account.uuid !== uuid
        );
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