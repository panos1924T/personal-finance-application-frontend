import { Component } from '@angular/core';
import { Account } from '../../models/account';

@Component({
  selector: 'app-accounts',
  imports: [],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {

  accounts: Account[] = [
    {
      uuid: '1',
      name: 'Cash',
      accountType: 'LIQUIDITY',
      balance: 350,
      createdAt: '2026-09-25'
    },
    {
      uuid: '2',
      name: 'Savings',
      accountType: 'SAVINGS',
      balance: 2200,
      createdAt: '2026-09-25'
    }
  ];
}
