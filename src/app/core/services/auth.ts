import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  displayName: string;
}

interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

interface RegisterResponse {
  uuid: string;
  email: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly registerApiUrl = 
    `/api/v1/users`;

  private readonly apiUrl =
    '/api/v1/auth/authenticate';

  private readonly displayNameState = signal<string | null>(
    localStorage.getItem('displayName')
  );  

  readonly displayName = this.displayNameState.asReadonly();

  constructor(
    private http: HttpClient
  ) {}

  login(
    credentials: LoginRequest
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        this.apiUrl,
        credentials
      )
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('displayName', response.displayName);
          this.displayNameState.set(response.displayName);
        })
      )
    }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
    this.displayNameState.set(null);
  }

  register(details: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      this.registerApiUrl,
      details
    );
  }
}