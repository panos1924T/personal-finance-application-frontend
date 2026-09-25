import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Account,
  AccountCreate,
  AccountUpdate
} from '../../models/account';

interface AccountPage {
  content: Account[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/accounts';

  constructor(private http: HttpClient) {}

  getAccounts(
    size: number = 20
  ): Observable<AccountPage> {

    return this.http.get<AccountPage>(
      this.apiUrl,
      {
        params: {
          size
        }
      }
    );
  }

  createAccount(account: AccountCreate): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
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

  deleteAccount(uuid: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${uuid}`
    );
  }
}