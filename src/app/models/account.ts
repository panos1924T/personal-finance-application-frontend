export interface Account {
  uuid: string;
  name: string;
  accountType: 'LIQUIDITY' | 'SAVINGS' | 'INVESTMENT' | 'CREDIT';
  balance: number;
  createdAt: string;
}

export interface AccountCreate {
  name: string;
  accountType: 'LIQUIDITY' | 'SAVINGS' | 'INVESTMENT' | 'CREDIT';
  initialBalance: number;
}