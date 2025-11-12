/**
 * Validate User Password Service
 * Validates a user's password against the stored hash
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';

import { findUserById } from './findUserById.js';

/**
 * Validate a user's password
 * Uses bcrypt comparison against the hashed password
 *
 * @param userId - User's ID
 * @param password - Plain text password to validate
 * @returns Validation result (true if password matches)
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const isValid = await validateUserPassword(
 *   'user-uuid-here',
 *   'userPassword123'
 * );
 * if (isValid.data) {
 *   console.log('Password is correct');
 * }
 * ```
 */
export const validateUserPassword = async (
  userId: string,
  password: string
): Promise<ApiResponse<boolean>> => {
  try {
    const userResponse = await findUserById(userId);
    const user = userResponse.data;

    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    const isValid = await user.validatePassword(password);

    return {
      success: true,
      data: isValid,
      message: isValid ? 'Password is valid' : 'Password is invalid',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error validating password',
      error instanceof Error ? error.message : String(error)
    );
  }
};
