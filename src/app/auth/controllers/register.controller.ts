// src/app/auth/controllers/register.controller.ts
/**
 * Register Controller
 * Handles HTTP request for user registration
 */

import { Request, Response, NextFunction } from 'express';
import { register } from '../services/register.service.js';

/**
 * Register new user
 * @route POST /api/auth/register
 * @access Public
 * @description Creates new user account and sets auth cookies
 */
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Register user (cookies are set automatically inside the service)
    const result = await register(req.body, res);

    // Return user data (tokens are in cookies, not in JSON)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
