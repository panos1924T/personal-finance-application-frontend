import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import { forkJoin } from 'rxjs';

import { Account } from '../../models/account';
import { Category } from '../../models/category';

import {
  Transaction,
  TransactionUpdate
} from '../../models/transaction';

import { AccountService } from '../../core/services/account';
import { CategoryService } from '../../core/services/category';
import { TransactionService } from '../../core/services/transaction';

import { TransactionForm } from './transaction-form/transaction-form';

@Component({
  selector: 'app-transactions',
  imports: [
    TransactionForm,
    DecimalPipe,
    FormsModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {

  transactions = signal<Transaction[]>([]);
  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);

  loading = signal(true);

  editingTransactionUuid: string | null = null;

  editDate = '';
  editAmount = 0;
  editDescription = '';

  editCategoryUuid = '';
  editSourceAccountUuid = '';
  editTargetAccountUuid = '';

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {

    forkJoin({
      transactions:
        this.transactionService.getTransactions(),

      accounts:
        this.accountService.getAccounts(),

      categories:
        this.categoryService.getCategories()
    }).subscribe({

      next: response => {

        this.transactions.set(
          response.transactions.content
        );

        this.accounts.set(
          response.accounts.content
        );

        this.categories.set(
          response.categories.content
        );

        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Failed to load transactions page',
          error
        );

        this.loading.set(false);
      }
    });
  }

  onTransactionCreated(
    transaction: Transaction
  ): void {

    this.transactions.update(transactions => [
      transaction,
      ...transactions
    ]);
  }

  startEdit(transaction: Transaction): void {

    this.editingTransactionUuid =
      transaction.uuid;

    this.editDate =
      transaction.transactionDate;

    this.editAmount =
      transaction.amount;

    this.editDescription =
      transaction.description ?? '';

    this.editCategoryUuid =
      transaction.categoryUuid ?? '';

    this.editSourceAccountUuid =
      transaction.sourceAccountUuid ?? '';

    this.editTargetAccountUuid =
      transaction.targetAccountUuid ?? '';
  }

  cancelEdit(): void {
    this.editingTransactionUuid = null;
  }

  saveEdit(transaction: Transaction): void {

    if (
      this.editAmount <= 0 ||
      this.isSameTransferEdit(transaction)
    ) {
      return;
    }

    const updatedTransaction: TransactionUpdate = {

      transactionDate: this.editDate,

      amount: this.editAmount,

      description:
        this.editDescription.trim() || null,

      categoryUuid:
        transaction.type === 'TRANSFER'
          ? null
          : this.editCategoryUuid || null,

      sourceAccountUuid:
        transaction.type === 'INCOME'
          ? transaction.sourceAccountUuid
          : this.editSourceAccountUuid || null,

      targetAccountUuid:
        transaction.type === 'TRANSFER'
          ? this.editTargetAccountUuid || null
          : null
    };

    this.transactionService
      .updateTransaction(
        transaction.uuid,
        updatedTransaction
      )
      .subscribe({

        next: updated => {

          this.transactions.update(
            transactions =>
              transactions.map(existing =>
                existing.uuid === updated.uuid
                  ? updated
                  : existing
              )
          );

          this.editingTransactionUuid = null;
        },

        error: error => {
          console.error(
            'Failed to update transaction',
            error
          );
        }
      });
  }

  onDeleteTransaction(uuid: string): void {

    this.transactionService
      .deleteTransaction(uuid)
      .subscribe({

        next: () => {

          this.transactions.update(
            transactions =>
              transactions.filter(
                transaction =>
                  transaction.uuid !== uuid
              )
          );
        },

        error: error => {
          console.error(
            'Failed to delete transaction',
            error
          );
        }
      });
  }

  getCategoriesByType(
    type: Transaction['type']
  ): Category[] {

    return this.categories().filter(
      category => category.type === type
    );
  }

  isSameTransferEdit(
    transaction: Transaction
  ): boolean {

    return (
      transaction.type === 'TRANSFER' &&
      this.editSourceAccountUuid !== '' &&
      this.editTargetAccountUuid !== '' &&
      this.editSourceAccountUuid ===
        this.editTargetAccountUuid
    );
  }
}