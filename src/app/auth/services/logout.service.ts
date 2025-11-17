// src/app/auth/services/logout.service.ts
/**
 * Logout Service
 * Clears authentication cookies and invalidates session
 */

import { Response } from 'express';
import { config } from '../../../core/config/env.js';
import { ApiResponse } from '../../../core/utils/crudServiceGenerator.js';

/**
 * Logout user by clearing authentication cookies
 *
 * @param res - Express response object
 * @returns Success response
 *
 * @example
 * ```typescript
 * // In your controller
 * const result = await logout(res);
 * return res.status(200).json(result);
 * ```
 */
export const logout = (res: Response): ApiResponse<null> => {
  // Clear access token cookie
  res.clearCookie(config.accessCookieName, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
  });

  // Clear refresh token cookie
  res.clearCookie(config.refreshCookieName, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return {
    success: true,
    data: null,
    message: 'Logout successful',
  };
};
