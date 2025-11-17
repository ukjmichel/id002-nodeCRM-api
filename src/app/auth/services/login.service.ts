// src/app/auth/services/login.service.ts
/**
 * Login Service
 * Authenticates user and generates tokens
 */

import { Response } from 'express';
import { ValidationError } from '../../../core/errors/index.js';
import { findUserByEmail } from '../../users/services/findUserByEmail.js';
import { AuthResponse, LoginDTO } from '../interfaces/auth.interface.js';
import { generateTokens } from './generateTokens.service.js';
import { setAuthCookies } from './sethAuthCookies.service.js';


/**
 * Authenticate user and generate tokens
 *
 * @param loginData - User login credentials
 * @param res - Express response object to set cookies
 * @returns Authentication response with user data only (tokens set in cookies)
 * @throws {ValidationError} When credentials are invalid
 *
 * @example
 * ```typescript
 * const result = await login({
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * }, res);
 * ```
 */
export const login = async (
  loginData: LoginDTO,
  res: Response
): Promise<Omit<AuthResponse, 'data'> & { data: { user: any } }> => {
  try {
    const { email, password } = loginData;

    // Find user by email
    const userResponse = await findUserByEmail(email);
    const user = userResponse.data;

    // Check if user exists
    if (!user) {
      throw new ValidationError(
        'Authentication failed',
        'Invalid email or password'
      );
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new ValidationError(
        'Authentication failed',
        'Invalid email or password'
      );
    }

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
