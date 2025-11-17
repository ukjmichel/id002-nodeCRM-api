// src/app/auth/services/setAuthCookies.service.ts
/**
 * Set Auth Cookies Service
 * Sets JWT tokens as HTTP-only cookies
 */

import { Response } from 'express';
import { config } from '../../../core/config/env.js';
import { AuthTokens } from '../interfaces/auth.interface.js';
import ms from 'ms';

/**
 * Set authentication tokens as HTTP-only cookies
 *
 * @param res - Express response object
 * @param tokens - Access and refresh tokens
 *
 * @example
 * ```typescript
 * const tokens = generateTokens(user);
 * setAuthCookies(res, tokens);
 * ```
 */
export const setAuthCookies = (res: Response, tokens: AuthTokens): void => {
  const isProduction = config.nodeEnv === 'production';

  // Set access token cookie
  res.cookie(config.accessCookieName, tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: ms(config.jwtExpiresIn),
    path: '/',
  });

  // Set refresh token cookie
  res.cookie(config.refreshCookieName, tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: ms(config.jwtRefreshExpiresIn),
    path: '/',
  });
};
