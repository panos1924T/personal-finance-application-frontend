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

  totalPages: number;
  totalElements: number;

  size: number;
  number: number;

  first: boolean;
  last: boolean;
}

export interface TransactionQueryParams {
  startDate?: string;
  endDate?: string;

  type?: TransactionType;

  categoryUuid?: string;
  accountUuid?: string;

  minAmount?: number;
  maxAmount?: number;

  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly apiUrl =
    'http://localhost:8080/api/v1/transactions';

  constructor(
    private http: HttpClient
  ) {}

  getTransactions(
    query: TransactionQueryParams = {}
  ): Observable<TransactionPage> {

    let params =
      new HttpParams();

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

    if (query.categoryUuid) {
      params = params.set(
        'categoryUuid',
        query.categoryUuid
      );
    }

    if (query.accountUuid) {
      params = params.set(
        'accountUuid',
        query.accountUuid
      );
    }

    if (
      query.minAmount !== undefined
    ) {
      params = params.set(
        'minAmount',
        query.minAmount
      );
    }

    if (
      query.maxAmount !== undefined
    ) {
      params = params.set(
        'maxAmount',
        query.maxAmount
      );
    }

    if (
      query.page !== undefined
    ) {
      params = params.set(
        'page',
        query.page
      );
    }

    if (
      query.size !== undefined
    ) {
      params = params.set(
        'size',
        query.size
      );
    }

    return this.http
      .get<TransactionPage>(
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