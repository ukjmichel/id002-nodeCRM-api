/**
 * Update Password Service
 * Updates a user's password
 */


import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';

import { UserModel } from '../models/user.model.js';
import { updateUser } from './updateUser.js';

/**
 * Update a user's password
 * Password will be automatically hashed by the model's BeforeUpdate hook
 *
 * @param userId - User's ID
 * @param newPassword - New plain text password
 * @returns Updated user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When update fails or password is invalid
 *
 * @example
 * ```typescript
 * const updatedUser = await updatePassword(
 *   'user-uuid-here',
 *   'newSecurePassword123'
 * );
 * console.log('Password updated successfully');
 * ```
 */
export const updatePassword = async (
  userId: string,
  newPassword: string
): Promise<ApiResponse<UserModel>> => {
  try {
    // Basic password validation
    if (!newPassword || newPassword.length < 6) {
      throw new ValidationError(
        'Password validation failed',
        'Password must be at least 6 characters long'
      );
    }

    const updatedUser = await updateUser(userId, {
      password: newPassword,
    });

    return {
      ...updatedUser,
      message: 'Password updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating password',
      error instanceof Error ? error.message : String(error)
    );
  }
};
