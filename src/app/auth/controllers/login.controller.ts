// src/app/auth/controllers/login.controller.ts
/**
 * Login Controller
 * Handles HTTP request for user login
 */

import { Request, Response, NextFunction } from 'express';
import { login } from '../services/login.service.js';

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 * @description Authenticates user and sets auth cookies
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Login user (cookies are set automatically inside the service)
    const result = await login(req.body, res);

    // Return user data (tokens are in cookies, not in JSON)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
