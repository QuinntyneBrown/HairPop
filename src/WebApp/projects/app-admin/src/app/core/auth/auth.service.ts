import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  MfaVerifyRequest,
  RefreshTokenRequest,
  User,
  AuthState,
  ApiError
} from './auth.models';

const AUTH_STORAGE_KEY = 'hpa_auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private authState = signal<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    requiresMfa: false,
    pendingMfaUserId: null
  });

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isLoading = computed(() => this.authState().isLoading);
  readonly error = computed(() => this.authState().error);
  readonly requiresMfa = computed(() => this.authState().requiresMfa);
  readonly accessToken = computed(() => this.authState().accessToken);

  private readonly apiUrl = `${environment.apiUrl}${environment.identityApiPath}`;

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.accessToken && data.user) {
          this.authState.update(state => ({
            ...state,
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true
          }));
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  private saveAuth(user: User, accessToken: string, refreshToken: string): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      user,
      accessToken,
      refreshToken
    }));
  }

  private clearAuth(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.authState.update(state => ({ ...state, isLoading: true, error: null }));

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.requiresMfa) {
          this.authState.update(state => ({
            ...state,
            isLoading: false,
            requiresMfa: true,
            pendingMfaUserId: response.userId
          }));
        } else if (response.accessToken) {
          const user: User = {
            userId: response.userId,
            email: response.email,
            displayName: response.displayName,
            roles: []
          };
          this.saveAuth(user, response.accessToken, response.refreshToken!);
          this.authState.update(state => ({
            ...state,
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            requiresMfa: false,
            pendingMfaUserId: null
          }));
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  verifyMfa(request: MfaVerifyRequest): Observable<LoginResponse> {
    this.authState.update(state => ({ ...state, isLoading: true, error: null }));

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/mfa/verify`, request).pipe(
      tap(response => {
        if (response.accessToken) {
          const user: User = {
            userId: response.userId,
            email: response.email,
            displayName: response.displayName,
            roles: []
          };
          this.saveAuth(user, response.accessToken, response.refreshToken!);
          this.authState.update(state => ({
            ...state,
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            requiresMfa: false,
            pendingMfaUserId: null
          }));
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.authState().refreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        if (response.accessToken) {
          const currentUser = this.authState().user;
          if (currentUser) {
            this.saveAuth(currentUser, response.accessToken, response.refreshToken!);
            this.authState.update(state => ({
              ...state,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            }));
          }
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    const refreshToken = this.authState().refreshToken;
    const userId = this.authState().user?.userId;

    if (refreshToken && userId) {
      this.http.post(`${this.apiUrl}/auth/logout`, { userId, refreshToken }).subscribe({
        error: () => {} // Ignore logout errors
      });
    }

    this.clearAuth();
    this.authState.set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      requiresMfa: false,
      pendingMfaUserId: null
    });
    this.router.navigate(['/login']);
  }

  clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error && typeof error.error === 'object') {
      const apiError = error.error as ApiError;
      errorMessage = apiError.detail || apiError.title || errorMessage;
    } else if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server';
    }

    this.authState.update(state => ({
      ...state,
      isLoading: false,
      error: errorMessage
    }));

    return throwError(() => new Error(errorMessage));
  }
}
