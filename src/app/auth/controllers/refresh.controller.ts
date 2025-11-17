// src/app/auth/controllers/refresh.controller.ts
/**
 * Refresh Token Controller
 * Handles HTTP request for refreshing access tokens
 */

import { Request, Response, NextFunction } from 'express';
import { refreshToken } from '../services/refreshToken.service.js';

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 * @access Public (requires valid refresh token cookie)
 * @description Generates new access token using refresh token from cookies
 */
export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Refresh token (reads from cookies, sets new cookies automatically)
    const result = await refreshToken(req, res);

    // Return success message (tokens are in cookies, not in JSON)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
