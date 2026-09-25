export interface Category {
  uuid: string;
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  parentUuid: string | null;
  parentName: string | null;
  group: boolean;
  isDeleted: boolean;
}

export interface CategoryCreate {
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  parentUuid: string | null;
}

export interface CategoryUpdate {
  name: string;
}