// src/app/auth/interfaces/auth.interface.ts
/**
 * Authentication Interfaces
 * TypeScript interfaces for authentication-related data
 */

export interface LoginDTO {
  username: string; // Changed from email to username
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  verified: boolean;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      userId: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      verified: boolean;
    };
    tokens: AuthTokens;
  };
  message: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
