import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, AccountCreate } from '../../models/account';

interface AccountPage {
  content: Account[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/accounts';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<AccountPage> {
    return this.http.get<AccountPage>(this.apiUrl);
  }

  createAccount(account: AccountCreate): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  deleteAccount(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}