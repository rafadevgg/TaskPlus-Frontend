import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UsuarioLogin, UsuarioRegistro, AuthResponse } from '../shared/models/Auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8089/api/auth';

  currentUser = signal<AuthResponse | null>(null);
  private _isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this._isAuthenticated.set(true);
    }
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  registro(data: UsuarioRegistro): Observable<AuthResponse> {
    console.log('Enviando registro para:', `${this.apiUrl}/register`);
    console.log('Dados:', data);

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        console.log('Resposta do registro:', response);
        this.handleAuthSuccess(response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro no registro:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        console.error('Error completo:', error.error);
        return throwError(() => error);
      })
    );
  }

  login(data: UsuarioLogin): Observable<AuthResponse> {
    console.log('Enviando login para:', `${this.apiUrl}/login`);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        console.log('Login bem-sucedido:', response);
        this.handleAuthSuccess(response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro no login:', error);
        return throwError(() => error);
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    console.log('Salvando autenticação...');
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    this.currentUser.set(response);
    this._isAuthenticated.set(true);
    console.log('Autenticação salva, redirecionando...');
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}