import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Account } from '../../../models/account';
import { Category } from '../../../models/category';

import {
  Transaction,
  TransactionCreate,
  TransactionType
} from '../../../models/transaction';

import { TransactionService } from '../../../core/services/transaction';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css'
})
export class TransactionForm {

  @Input() accounts: Account[] = [];
  @Input() categories: Category[] = [];

  @Output()
  transactionCreated = new EventEmitter<Transaction>();

  transactionForm;

  isSameTransferAccount(): boolean {

    if (
      this.transactionForm.controls.type.value !== 'TRANSFER'
    ) {
      return false;
    }

    const source =
      this.transactionForm.controls.sourceAccountUuid.value;

    const target =
      this.transactionForm.controls.targetAccountUuid.value;

    return (
      source !== '' &&
      target !== '' &&
      source === target
    );
  }

  private getToday(): string {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      today.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } 

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {

    this.transactionForm = this.fb.nonNullable.group({
      transactionDate: [
        this.getToday(),
        Validators.required
      ],

      type: [
        'EXPENSE' as TransactionType,
        Validators.required
      ],

      amount: [
        0,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      description: [''],
      categoryUuid: [''],
      sourceAccountUuid: [''],
      targetAccountUuid: ['']
    });

    this.updateValidators('EXPENSE');

    this.transactionForm.controls.type.valueChanges
      .subscribe(type => {
        this.updateValidators(type);

        this.transactionForm.patchValue({
          categoryUuid: '',
          sourceAccountUuid: '',
          targetAccountUuid: ''
        });
      });
  }

  onSubmit(): void {

    if (
      this.transactionForm.invalid ||
      this.isSameTransferAccount()
      ) {
        return;
    }

    const value = this.transactionForm.getRawValue();

    const transaction: TransactionCreate = {
      transactionDate: value.transactionDate,
      type: value.type,
      amount: value.amount,

      description:
        value.description.trim() || null,

      categoryUuid:
        value.categoryUuid || null,

      sourceAccountUuid:
        value.sourceAccountUuid || null,

      targetAccountUuid:
        value.targetAccountUuid || null
    };

    this.transactionService
      .createTransaction(transaction)
      .subscribe({
        next: created => {

          this.transactionCreated.emit(created);

          this.transactionForm.reset({
            transactionDate: this.getToday(),
            type: 'EXPENSE',
            amount: 0,
            description: '',
            categoryUuid: '',
            sourceAccountUuid: '',
            targetAccountUuid: ''
          });

          this.updateValidators('EXPENSE');
        },

        error: error => {
          console.error(
            'Failed to create transaction',
            error
          );
        }
      });
  }

  getCategoriesForSelectedType(): Category[] {

    const type =
      this.transactionForm.controls.type.value;

    if (type === 'TRANSFER') {
      return [];
    }

    return this.categories.filter(
      category => category.type === type
    );
  }

  private updateValidators(
    type: TransactionType
  ): void {

    const category =
      this.transactionForm.controls.categoryUuid;

    const source =
      this.transactionForm.controls.sourceAccountUuid;

    const target =
      this.transactionForm.controls.targetAccountUuid;

    category.clearValidators();
    source.clearValidators();
    target.clearValidators();

    if (type === 'INCOME') {
      category.setValidators(
        Validators.required
      );
    }

    if (type === 'EXPENSE') {
      category.setValidators(
        Validators.required
      );

      source.setValidators(
        Validators.required
      );
    }

    if (type === 'TRANSFER') {
      source.setValidators(
        Validators.required
      );

      target.setValidators(
        Validators.required
      );
    }

    category.updateValueAndValidity();
    source.updateValueAndValidity();
    target.updateValueAndValidity();
  }
}