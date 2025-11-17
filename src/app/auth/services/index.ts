// src/app/auth/services/index.ts
/**
 * =============================================================================
 * Auth Service - Main Export
 * =============================================================================
 * Combines all auth service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import {
  AuthResponse,
  AuthTokens,
  LoginDTO,
  RegisterDTO,
} from '../interfaces/auth.interface.js';
import { UserModel } from '../../users/models/user.model.js';
import { TokenPayload } from '../interfaces/auth.interface.js';
import { Request, Response } from 'express';
import { login } from './login.service.js';
import { register } from './register.service.js';
import { logout } from './logout.service.js';
import { refreshToken } from './refreshToken.service.js';
import { generateTokens } from './generateTokens.service.js';

import {
  verifyAccessToken,
  verifyRefreshToken,
} from './verifyToken.service.js';
import { setAuthCookies } from './sethAuthCookies.service.js';

/**
 * Auth Service Interface
 * Defines all authentication and token management operations
 */
export interface IAuthService {
  login(
    loginData: LoginDTO,
    res: Response
  ): Promise<Omit<AuthResponse, 'data'> & { data: { user: any } }>;
  register(
    registerData: RegisterDTO,
    res: Response
  ): Promise<Omit<AuthResponse, 'data'> & { data: { user: any } }>;
  logout(
    res: Response
  ): import('../../../core/utils/crudServiceGenerator.js').ApiResponse<null>;
  refreshToken(
    req: Request,
    res: Response
  ): Promise<{ success: boolean; message: string }>;
  generateTokens(user: UserModel): AuthTokens;
  setAuthCookies(res: Response, tokens: AuthTokens): void;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}

/**
 * Auth Service
 * Provides authentication, registration, and token management
 *
 * IMPORTANT: Tokens are ONLY stored in HTTP-only cookies, never returned in JSON responses.
 *
 * @example
 * ```typescript
 * import { authService } from './services/auth';
 *
 * // Register new user (tokens set in cookies automatically)
 * const newUser = await authService.register({
 *   username: 'johndoe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * }, res);
 * // Response contains only user data, tokens are in cookies
 *
 * // Login user (tokens set in cookies automatically)
 * const auth = await authService.login({
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * }, res);
 * // Response contains only user data, tokens are in cookies
 *
 * // Refresh access token (new tokens set in cookies automatically)
 * const result = await authService.refreshToken(req, res);
 * // Response contains only success message, tokens are in cookies
 *
 * // Logout user (clears cookies)
 * const logoutResult = authService.logout(res);
 *
 * // Internal: Generate tokens (used internally by login/register)
 * const tokens = authService.generateTokens(user);
 *
 * // Internal: Set cookies (called internally by login/register/refresh)
 * authService.setAuthCookies(res, tokens);
 *
 * // Verify access token from cookies in middleware
 * const payload = authService.verifyAccessToken(token);
 *
 * // Verify refresh token from cookies
 * const refreshPayload = authService.verifyRefreshToken(refreshToken);
 * ```
 */
export const authService: IAuthService = {
  // Authentication Operations
  login,
  register,
  logout,
  refreshToken,

  // Token Operations
  generateTokens,
  setAuthCookies,
  verifyAccessToken,
  verifyRefreshToken,
};

export default authService;

// Re-export individual methods for direct imports if needed
export {
  login,
  register,
  logout,
  refreshToken,
  generateTokens,
  setAuthCookies,
  verifyAccessToken,
  verifyRefreshToken,
};

// Re-export types and interfaces for convenience
export type {
  AuthResponse,
  AuthTokens,
  LoginDTO,
  RegisterDTO,
  TokenPayload,
} from '../interfaces/auth.interface.js';
