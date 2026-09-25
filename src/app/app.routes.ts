import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./features/accounts/accounts').then(m => m.Accounts)
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transactions').then(m => m.Transactions)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories').then(m => m.Categories)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];