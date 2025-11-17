// src/app/users/services/updatePassword.ts
/**
 * Update Password Service
 * Updates a user's password
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

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

    // Find the user
    const record = await UserModel.findByPk(userId);

    if (!record) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    // Update password directly (will be hashed by BeforeUpdate hook)
    await record.update({ password: newPassword });

    return {
      success: true,
      data: record,
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
