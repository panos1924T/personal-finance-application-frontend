export type TransactionType =
  'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  uuid: string;
  amount: number;
  transactionDate: string;
  description: string | null;
  type: TransactionType;

  sourceAccountUuid: string;
  sourceAccountName: string;

  targetAccountUuid: string | null;
  targetAccountName: string | null;

  categoryUuid: string | null;
  categoryName: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface TransactionCreate {
  transactionDate: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  categoryUuid: string | null;
  sourceAccountUuid: string | null;
  targetAccountUuid: string | null;
}

export interface TransactionUpdate {
  transactionDate: string;
  amount: number;
  description: string | null;
  categoryUuid: string | null;
  sourceAccountUuid: string | null;
  targetAccountUuid: string | null;
}