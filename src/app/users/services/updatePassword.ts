// src/app/users/services/updatePassword.ts
/**
 * Update Password Service
 * Updates a user's password
 */

import { Transaction } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

/**
 * Update a user's password
 * Password will be automatically hashed by the model's BeforeUpdate hook
 *
 * @param userId - User's ID
 * @param newPassword - New plain text password
 * @param transaction - Optional transaction object
 * @returns Updated user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When update fails or password is invalid
 *
 * @example
 * ```typescript
 * // Without transaction
 * const updatedUser = await updatePassword(
 *   'user-uuid-here',
 *   'newSecurePassword123'
 * );
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   await updatePassword('user-uuid-here', 'newSecurePassword123', t);
 *   // Other operations...
 * });
 * ```
 */
export const updatePassword = async (
  userId: string,
  newPassword: string,
  transaction?: Transaction
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
    const findOptions: any = {};
    if (transaction) {
      findOptions.transaction = transaction;
    }
    const record = await UserModel.findByPk(userId, findOptions);

    if (!record) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    // Update password directly (will be hashed by BeforeUpdate hook)
    const updateOptions: any = {};
    if (transaction) {
      updateOptions.transaction = transaction;
    }
    await record.update({ password: newPassword }, updateOptions);

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
