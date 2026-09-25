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
  TransactionType,
  TransactionUpdate
} from '../../models/transaction';

import { AccountService } from '../../core/services/account';
import { CategoryService } from '../../core/services/category';

import {
  TransactionQueryParams,
  TransactionService
} from '../../core/services/transaction';

import { NotificationService } from '../../core/services/notification';

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

  transactions =
    signal<Transaction[]>([]);

  accounts =
    signal<Account[]>([]);

  categories =
    signal<Category[]>([]);

  loading =
    signal(true);

  currentPage =
    signal(0);

  totalPages =
    signal(0);

  totalElements =
    signal(0);

  readonly pageSize = 10;


  filterStartDate = '';
  filterEndDate = '';

  filterType:
    TransactionType | '' = '';

  filterCategoryUuid = '';
  filterAccountUuid = '';

  filterMinAmount:
    number | null = null;

  filterMaxAmount:
    number | null = null;


  editingTransactionUuid:
    string | null = null;

  editDate = '';
  editAmount = 0;
  editDescription = '';

  editCategoryUuid = '';
  editSourceAccountUuid = '';
  editTargetAccountUuid = '';


  constructor(
    private transactionService:
      TransactionService,

    private accountService:
      AccountService,

    private categoryService:
      CategoryService,

    private notification:
      NotificationService
  ) {}


  ngOnInit(): void {

    forkJoin({

      accounts:
        this.accountService
          .getAccounts(1000),

      categories:
        this.categoryService
          .getCategories()

    }).subscribe({

      next: response => {

        this.accounts.set(
          response.accounts.content
        );

        this.categories.set(
          response.categories.content
        );
      },

      error: error => {

        this.notification.apiError(
          error,
          'Failed to load transaction filters.'
        );
      }
    });

    this.loadTransactions(0);
  }


  loadTransactions(
    page: number
  ): void {

    this.loading.set(true);

    const query:
      TransactionQueryParams = {

      page,
      size: this.pageSize
    };

    if (this.filterStartDate) {
      query.startDate =
        this.filterStartDate;
    }

    if (this.filterEndDate) {
      query.endDate =
        this.filterEndDate;
    }

    if (this.filterType) {
      query.type =
        this.filterType;
    }

    if (this.filterCategoryUuid) {
      query.categoryUuid =
        this.filterCategoryUuid;
    }

    if (this.filterAccountUuid) {
      query.accountUuid =
        this.filterAccountUuid;
    }

    if (
      this.filterMinAmount !== null
    ) {
      query.minAmount =
        this.filterMinAmount;
    }

    if (
      this.filterMaxAmount !== null
    ) {
      query.maxAmount =
        this.filterMaxAmount;
    }

    this.transactionService
      .getTransactions(query)
      .subscribe({

        next: response => {

          this.transactions.set(
            response.content
          );

          this.currentPage.set(
            response.number
          );

          this.totalPages.set(
            response.totalPages
          );

          this.totalElements.set(
            response.totalElements
          );

          this.loading.set(false);
        },

        error: error => {

          this.notification.apiError(
            error,
            'Failed to load transactions.'
          );

          this.loading.set(false);
        }
      });
  }


  applyFilters(): void {

    if (
      this.filterStartDate &&
      this.filterEndDate &&
      this.filterStartDate >
        this.filterEndDate
    ) {

      this.notification.error(
        'Start date cannot be after end date.'
      );

      return;
    }

    if (
      this.filterMinAmount !== null &&
      this.filterMaxAmount !== null &&
      this.filterMinAmount >
        this.filterMaxAmount
    ) {

      this.notification.error(
        'Minimum amount cannot be greater than maximum amount.'
      );

      return;
    }

    this.loadTransactions(0);
  }


  clearFilters(): void {

    this.filterStartDate = '';
    this.filterEndDate = '';

    this.filterType = '';

    this.filterCategoryUuid = '';
    this.filterAccountUuid = '';

    this.filterMinAmount = null;
    this.filterMaxAmount = null;

    this.loadTransactions(0);
  }


  onFilterTypeChange(): void {

    if (
      this.filterType === 'TRANSFER'
    ) {

      this.filterCategoryUuid = '';
      return;
    }

    if (
      this.filterType &&
      this.filterCategoryUuid
    ) {

      const selectedCategory =
        this.categories().find(
          category =>
            category.uuid ===
            this.filterCategoryUuid
        );

      if (
        selectedCategory &&
        selectedCategory.type !==
          this.filterType
      ) {

        this.filterCategoryUuid = '';
      }
    }
  }


  getFilterCategories():
    Category[] {

    if (
      this.filterType === 'TRANSFER'
    ) {
      return [];
    }

    if (!this.filterType) {

      return this.categories().filter(
        category =>
          category.type !== 'TRANSFER'
      );
    }

    return this.categories().filter(
      category =>
        category.type ===
        this.filterType
    );
  }


  previousPage(): void {

    if (
      this.currentPage() > 0
    ) {

      this.loadTransactions(
        this.currentPage() - 1
      );
    }
  }


  nextPage(): void {

    if (
      this.currentPage() <
      this.totalPages() - 1
    ) {

      this.loadTransactions(
        this.currentPage() + 1
      );
    }
  }


  onTransactionCreated(
    transaction: Transaction
  ): void {

    this.loadTransactions(0);
  }


  startEdit(
    transaction: Transaction
  ): void {

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


  saveEdit(
    transaction: Transaction
  ): void {

    if (
      this.editAmount <= 0 ||
      this.isSameTransferEdit(transaction)
    ) {
      return;
    }

    const updatedTransaction:
      TransactionUpdate = {

      transactionDate:
        this.editDate,

      amount:
        this.editAmount,

      description:
        this.editDescription
          .trim() || null,

      categoryUuid:
        transaction.type ===
        'TRANSFER'
          ? null
          : this.editCategoryUuid ||
            null,

      sourceAccountUuid:
        transaction.type ===
        'INCOME'
          ? transaction
              .sourceAccountUuid
          : this.editSourceAccountUuid ||
            null,

      targetAccountUuid:
        transaction.type ===
        'TRANSFER'
          ? this.editTargetAccountUuid ||
            null
          : null
    };

    this.transactionService
      .updateTransaction(
        transaction.uuid,
        updatedTransaction
      )
      .subscribe({

        next: () => {

          this.editingTransactionUuid =
            null;

          this.notification.success(
            'Transaction updated successfully.'
          );

          this.loadTransactions(
            this.currentPage()
          );
        },

        error: error => {

          this.notification.apiError(
            error,
            'Failed to update transaction.'
          );
        }
      });
  }


  onDeleteTransaction(
    uuid: string
  ): void {

    const confirmed =
      window.confirm(
        'Delete this transaction? Its effect on account balances will be reversed.'
      );

    if (!confirmed) {
      return;
    }

    this.transactionService
      .deleteTransaction(uuid)
      .subscribe({

        next: () => {

          const targetPage =
            this.transactions()
              .length === 1 &&
            this.currentPage() > 0
              ? this.currentPage() - 1
              : this.currentPage();

          this.notification.success(
            'Transaction deleted successfully.'
          );

          this.loadTransactions(
            targetPage
          );
        },

        error: error => {

          this.notification.apiError(
            error,
            'Failed to delete transaction.'
          );
        }
      });
  }


  getCategoriesByType(
    type: Transaction['type']
  ): Category[] {

    return this.categories().filter(
      category =>
        category.type === type
    );
  }


  isSameTransferEdit(
    transaction: Transaction
  ): boolean {

    return (
      transaction.type ===
        'TRANSFER' &&

      this.editSourceAccountUuid !==
        '' &&

      this.editTargetAccountUuid !==
        '' &&

      this.editSourceAccountUuid ===
        this.editTargetAccountUuid
    );
  }
}