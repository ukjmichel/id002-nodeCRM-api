// src/app/auth/services/refreshToken.service.ts
/**
 * Refresh Token Service
 * Generates new access token using refresh token
 */

import { Request, Response } from 'express';
import { config } from '../../../core/config/env.js';
import { ValidationError } from '../../../core/errors/index.js';
import { findUserById } from '../../users/services/findUserById.js';
import { AuthTokens } from '../interfaces/auth.interface.js';
import { generateTokens } from './generateTokens.service.js';

import { verifyRefreshToken } from './verifyToken.service.js';
import { setAuthCookies } from './sethAuthCookies.service.js';

/**
 * Refresh access token using refresh token from cookies
 *
 * @param req - Express request object (to read cookies)
 * @param res - Express response object (to set new cookies)
 * @returns Success response (tokens set in cookies only)
 * @throws {ValidationError} When refresh token is invalid or user not found
 *
 * @example
 * ```typescript
 * // In your controller
 * const result = await refreshToken(req, res);
 * return res.status(200).json(result);
 * ```
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get refresh token from cookie
    const refreshTokenCookie = req.cookies[config.refreshCookieName];

    if (!refreshTokenCookie) {
      throw new ValidationError(
        'Refresh token missing',
        'No refresh token found in cookies'
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshTokenCookie);

    // Find user by ID from token payload
    const userResponse = await findUserById(payload.userId);
    const user = userResponse.data;

    if (!user) {
      throw new ValidationError(
        'User not found',
        'User associated with this token no longer exists'
      );
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Set new auth cookies (tokens NOT returned in response)
    setAuthCookies(res, tokens);

    return {
      success: true,
      message: 'Token refreshed successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Token refresh failed',
      error instanceof Error ? error.message : 'Failed to refresh token'
    );
  }
};
