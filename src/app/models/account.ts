export interface Account {
  uuid: string;
  name: string;
  accountType: 'LIQUIDITY' | 'SAVINGS' | 'INVESTMENT' | 'CREDIT';
  balance: number;
  createdAt: string;
}