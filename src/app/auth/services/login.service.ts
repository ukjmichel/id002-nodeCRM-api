// src/app/auth/services/login.service.ts
/**
 * Login Service
 * Authenticates user and generates tokens
 * Uses username for login (not email)
 */

import { Response } from 'express';
import { ValidationError } from '../../../core/errors/index.js';
import { findUserByUsername } from '../../users/services/findUserByUsername.js';
import { AuthResponse, LoginDTO } from '../interfaces/auth.interface.js';
import { generateTokens } from './generateTokens.service.js';
import { setAuthCookies } from './sethAuthCookies.service.js';

/**
 * Authenticate user and generate tokens
 * Login is performed using username only
 *
 * @param loginData - User login credentials (username + password)
 * @param res - Express response object to set cookies
 * @returns Authentication response with user data only (tokens set in cookies)
 * @throws {ValidationError} When credentials are invalid
 *
 * @example
 * ```typescript
 * const result = await login({
 *   username: 'johndoe',
 *   password: 'SecurePass123'
 * }, res);
 * ```
 */
export const login = async (
  loginData: LoginDTO,
  res: Response
): Promise<Omit<AuthResponse, 'data'> & { data: { user: any } }> => {
  try {
    const { username, password } = loginData;

    // Validate input
    if (!username || !password) {
      throw new ValidationError(
        'Authentication failed',
        'Username and password are required'
      );
    }

    // Find user by username
    let userResponse;
    try {
      userResponse = await findUserByUsername(username);
    } catch (error) {
      // Don't reveal whether the username exists
      throw new ValidationError(
        'Authentication failed',
        'Invalid username or password'
      );
    }

    const user = userResponse.data;

    // Check if user exists (additional safety check)
    if (!user) {
      throw new ValidationError(
        'Authentication failed',
        'Invalid username or password'
      );
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new ValidationError(
        'Authentication failed',
        'Invalid username or password'
      );
    }

    // Optional: Check if user is verified
    // Uncomment if you want to enforce email verification before login
    // if (!user.verified) {
    //   throw new ValidationError(
    //     'Authentication failed',
    //     'Please verify your email address before logging in'
    //   );
    // }

    // Generate tokens
    const tokens = generateTokens(user);

    // Set tokens in HTTP-only cookies
    setAuthCookies(res, tokens);

    // Return user data (WITHOUT tokens - they're in cookies)
    return {
      success: true,
      data: {
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verified: user.verified,
        },
      },
      message: 'Login successful',
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Login failed',
      error instanceof Error ? error.message : 'Authentication error'
    );
  }
};
