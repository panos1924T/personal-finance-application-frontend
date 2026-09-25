import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  Transaction,
  TransactionCreate,
  TransactionType,
  TransactionUpdate
} from '../../models/transaction';

export interface TransactionPage {
  content: Transaction[];
}

interface TransactionQueryParams {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly apiUrl =
    'http://localhost:8080/api/v1/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(
    query: TransactionQueryParams = {}
  ): Observable<TransactionPage> {

    let params = new HttpParams();

    if (query.startDate) {
      params = params.set(
        'startDate',
        query.startDate
      );
    }

    if (query.endDate) {
      params = params.set(
        'endDate',
        query.endDate
      );
    }

    if (query.type) {
      params = params.set(
        'type',
        query.type
      );
    }

    if (query.size) {
      params = params.set(
        'size',
        query.size
      );
    }

    return this.http.get<TransactionPage>(
      this.apiUrl,
      { params }
    );
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

  deleteTransaction(
    uuid: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${uuid}`
    );
  }
}