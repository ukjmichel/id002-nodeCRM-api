// src/app/auth/controllers/login.controller.ts
/**
 * Login Controller
 * Handles user login with JWT token generation and cookie management
 * Uses username for authentication
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { login } from '../services/login.service.js';
import { ValidationError } from '../../../core/errors/index.js';

/**
 * Login request body interface
 */
export interface LoginRequestBody {
  username: string;
  password: string;
}

/**
 * Login Controller
 * Authenticates user by username and sets JWT tokens in cookies
 *
 * @route POST /api/auth/login
 * @access Public
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @returns {Promise<Response>} JSON response with user data
 *
 * @throws {ValidationError} When validation fails or credentials are invalid
 *
 * @example
 * Request body:
 * {
 *   "username": "johndoe",
 *   "password": "securePassword123"
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "userId": "uuid-here",
 *       "username": "johndoe",
 *       "email": "john@example.com",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "verified": true
 *     }
 *   },
 *   "message": "Login successful"
 * }
 *
 * Response (400):
 * {
 *   "success": false,
 *   "message": "Invalid username or password"
 * }
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(
        'Validation failed',
        errors
          .array()
          .map((err) => err.msg)
          .join(', ')
      );
    }

    const { username, password } = req.body as LoginRequestBody;

    // Call login service
    const result = await login({ username, password }, res);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
