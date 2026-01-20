export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  displayName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number;
  requiresMfa: boolean;
}

export interface MfaVerifyRequest {
  userId: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  userId: string;
  email: string;
  displayName: string | null;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresMfa: boolean;
  pendingMfaUserId: string | null;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}
