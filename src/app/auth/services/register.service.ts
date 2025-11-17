// src/app/auth/services/register.service.ts
/**
 * Register Service
 * Creates new user account and generates tokens
 */

import { Response } from 'express';
import { ValidationError } from '../../../core/errors/index.js';
import { createUser } from '../../users/services/createUser.js';
import { AuthResponse, RegisterDTO } from '../interfaces/auth.interface.js';
import { generateTokens } from './generateTokens.service.js';
import { setAuthCookies } from './sethAuthCookies.service.js';
;

/**
 * Register new user and generate tokens
 *
 * @param registerData - User registration data
 * @param res - Express response object to set cookies
 * @returns Authentication response with user data only (tokens set in cookies)
 * @throws {ValidationError} When registration fails
 *
 * @example
 * ```typescript
 * const result = await register({
 *   username: 'johndoe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * }, res);
 * ```
 */
export const register = async (
  registerData: RegisterDTO,
  res: Response
): Promise<Omit<AuthResponse, 'data'> & { data: { user: any } }> => {
  try {
    // Create user (verified will be set to false automatically)
    const userResponse = await createUser(registerData);
    const user = userResponse.data;

    // Check if user was created successfully
    if (!user) {
      throw new ValidationError(
        'Registration failed',
        'Failed to create user account'
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
      message: 'Registration successful',
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Registration failed',
      error instanceof Error ? error.message : 'Registration error'
    );
  }
};
