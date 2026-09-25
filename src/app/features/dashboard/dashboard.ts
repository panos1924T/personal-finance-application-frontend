import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import { forkJoin } from 'rxjs';

import { Transaction } from '../../models/transaction';

import { AccountService } from '../../core/services/account';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalBalance = signal(0);
  monthlyIncome = signal(0);
  monthlyExpenses = signal(0);
  netSavings = signal(0);

  recentTransactions =
    signal<Transaction[]>([]);

  loading = signal(true);

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {

    const {
      startDate,
      endDate
    } = this.getCurrentMonthRange();

    forkJoin({

      accounts:
        this.accountService.getAccounts(1000),

      income:
        this.transactionService.getTransactions({
          startDate,
          endDate,
          type: 'INCOME',
          size: 1000
        }),

      expenses:
        this.transactionService.getTransactions({
          startDate,
          endDate,
          type: 'EXPENSE',
          size: 1000
        }),

      recent:
        this.transactionService.getTransactions({
          size: 5
        })

    }).subscribe({

      next: response => {

        const balance =
          response.accounts.content.reduce(
            (sum, account) =>
              sum + account.balance,
            0
          );

        const income =
          response.income.content.reduce(
            (sum, transaction) =>
              sum + transaction.amount,
            0
          );

        const expenses =
          response.expenses.content.reduce(
            (sum, transaction) =>
              sum + transaction.amount,
            0
          );

        this.totalBalance.set(balance);
        this.monthlyIncome.set(income);
        this.monthlyExpenses.set(expenses);

        this.netSavings.set(
          income - expenses
        );

        this.recentTransactions.set(
          response.recent.content
        );

        this.loading.set(false);
      },

      error: error => {

        console.error(
          'Failed to load dashboard',
          error
        );

        this.loading.set(false);
      }
    });
  }

  private getCurrentMonthRange(): {
    startDate: string;
    endDate: string;
  } {

    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    return {
      startDate:
        this.formatDate(firstDay),

      endDate:
        this.formatDate(lastDay)
    };
  }

  private formatDate(
    date: Date
  ): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}