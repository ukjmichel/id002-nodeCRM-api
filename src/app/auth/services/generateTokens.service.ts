// src/app/auth/services/generateTokens.service.ts
/**
 * Generate Tokens Service
 * Creates JWT access and refresh tokens
 */

import jwt from 'jsonwebtoken';
import { config } from '../../../core/config/env.js';
import { AuthTokens, TokenPayload } from '../interfaces/auth.interface.js';
import { UserModel } from '../../users/models/user.model.js';

/**
 * Generate JWT access and refresh tokens
 *
 * @param user - User model instance
 * @returns Object containing access and refresh tokens
 *
 * @example
 * ```typescript
 * const tokens = generateTokens(user);
 * console.log(tokens.accessToken);
 * console.log(tokens.refreshToken);
 * ```
 */
export const generateTokens = (user: UserModel): AuthTokens => {
  const payload: TokenPayload = {
    userId: user.userId,
    email: user.email,
    username: user.username,
    verified: user.verified,
  };

  const accessToken = jwt.sign(payload, config.jwtSecret || 'your-secret-key', {
    expiresIn: config.jwtExpiresIn || '15m',
  });

  const refreshToken = jwt.sign(
    payload,
    config.jwtRefreshSecret || 'your-refresh-secret-key',
    {
      expiresIn: config.jwtRefreshExpiresIn || '7d',
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};
