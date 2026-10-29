import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

import {
  Account,
  AccountCreate,
  AccountUpdate
} from '../../models/account';

interface AccountPage {
  content: Account[];
  totalPages: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly apiUrl =
    '/api/v1/accounts';

  constructor(
    private http: HttpClient
  ) {}

  getAccounts(
    page = 0,
      size = 100
    ): Observable<AccountPage> {
      const params = new HttpParams()
        .set('page', page)
        .set('size', size);

      return this.http.get<AccountPage>(
        this.apiUrl,
        { params }
      );
    }

  getAllAccounts(): Observable<Account[]> {
    return this.getAccounts().pipe(
      switchMap(firstPage => {
        const remainingPages = Array.from(
          { length: Math.max(0, firstPage.totalPages - 1) },
          (_, index) =>
            this.getAccounts(index + 1, firstPage.size)
        );

        if (remainingPages.length === 0) {
          return of(firstPage.content);
        }

        return forkJoin(remainingPages).pipe(
          map(pages => [
            ...firstPage.content,
            ...pages.flatMap(page => page.content)
          ])
        );
      })
    );
  }

  createAccount(
    account: AccountCreate
  ): Observable<Account> {

    return this.http.post<Account>(
      this.apiUrl,
      account
    );
  }

  updateAccount(
    uuid: string,
    account: AccountUpdate
  ): Observable<Account> {

    return this.http.put<Account>(
      `${this.apiUrl}/${uuid}`,
      account
    );
  }

  deleteAccount(
    uuid: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${uuid}`
    );
  }
}