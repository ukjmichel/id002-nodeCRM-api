// src/app/auth/controllers/logout.controller.ts
/**
 * Logout Controller
 * Handles HTTP request for user logout
 */

import { Request, Response, NextFunction } from 'express';
import { logout } from '../services/logout.service.js';

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Public
 * @description Clears authentication cookies
 */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Clear authentication cookies
    const result = logout(res);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
