// src/app/auth/services/verifyToken.service.ts
/**
 * Verify Token Service
 * Verifies and decodes JWT tokens
 */

import jwt from 'jsonwebtoken';
import { config } from '../../../core/config/env.js';
import { TokenPayload } from '../interfaces/auth.interface.js';
import { ValidationError } from '../../../core/errors/index.js';

/**
 * Verify JWT access token
 *
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws {ValidationError} When token is invalid or expired
 *
 * @example
 * ```typescript
 * const payload = verifyAccessToken(token);
 * console.log(payload.userId);
 * ```
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwtSecret || 'your-secret-key'
    ) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new ValidationError(
      'Invalid token',
      error instanceof Error ? error.message : 'Token verification failed'
    );
  }
};

/**
 * Verify JWT refresh token
 *
 * @param token - JWT refresh token to verify
 * @returns Decoded token payload
 * @throws {ValidationError} When token is invalid or expired
 *
 * @example
 * ```typescript
 * const payload = verifyRefreshToken(refreshToken);
 * console.log(payload.userId);
 * ```
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwtRefreshSecret || 'your-refresh-secret-key'
    ) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new ValidationError(
      'Invalid refresh token',
      error instanceof Error ? error.message : 'Token verification failed'
    );
  }
};
