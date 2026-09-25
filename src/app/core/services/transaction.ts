import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Transaction,
  TransactionCreate,
  TransactionUpdate
} from '../../models/transaction';

interface TransactionPage {
  content: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly apiUrl =
    'http://localhost:8080/api/v1/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<TransactionPage> {
    return this.http.get<TransactionPage>(this.apiUrl);
  }

  createTransaction(
    transaction: TransactionCreate
  ): Observable<Transaction> {

    return this.http.post<Transaction>(
      this.apiUrl,
      transaction
    );
  }

  updateTransaction(
    uuid: string,
    transaction: TransactionUpdate
  ): Observable<Transaction> {

    return this.http.put<Transaction>(
      `${this.apiUrl}/${uuid}`,
      transaction
    );
  }

  deleteTransaction(uuid: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${uuid}`
    );
  }
}