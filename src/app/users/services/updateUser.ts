// src/app/users/services/updateUser.ts
/**
 * Update User Service
 * Updates a user record by ID
 * Note: verified status and password cannot be changed through this service
 */

import { Transaction, UpdateOptions } from 'sequelize';
import { UserAttributes } from '../interfaces/user.interface.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import {
  checkDuplicateEmail,
  checkDuplicateUsername,
  shouldValidateField,
} from '../utils/duplicateValidation.js';

/**
 * Update a user by ID
 * The verified and password fields are automatically excluded from updates
 * Use dedicated services to change these sensitive fields
 * Validates that username and email are unique before attempting update
 *
 * @param id - User ID
 * @param data - Data to update
 * @param options - Sequelize update options
 * @param transaction - Optional transaction object
 * @returns Updated user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When update fails or duplicate found
 *
 * @example
 * ```typescript
 * // Without transaction
 * const updatedUser = await updateUser('user-uuid-here', {
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   email: 'jane@example.com',
 *   username: 'janedoe'
 * });
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   await updateUser('user-uuid-here', {
 *     firstName: 'Jane'
 *   }, undefined, t);
 *   // Other operations...
 * });
 *
 * // These fields will be IGNORED:
 * await updateUser('user-uuid-here', {
 *   verified: true,  // verified field is ignored
 *   password: 'newPass123' // password field is ignored
 * });
 *
 * // Use dedicated services instead:
 * await verifyUser('user-uuid-here');           // To verify
 * await unverifyUser('user-uuid-here');         // To unverify
 * await updatePassword('user-uuid-here', 'newPass123'); // To change password
 * ```
 */
export const updateUser = async (
  id: number | string,
  data: Partial<UserAttributes>,
  options?: UpdateOptions,
  transaction?: Transaction
): Promise<ApiResponse<UserModel>> => {
  try {
    const record = await UserModel.findByPk(id, { transaction });

    if (!record) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    // Remove protected fields from update data to prevent modification
    // Use dedicated services for these fields:
    // - verifyUser() / unverifyUser() for verified status
    // - updatePassword() for password changes
    const { verified, password, ...updateData } = data;

    // Check for duplicate email if email is being updated
    if (
      updateData.email &&
      shouldValidateField(record.email, updateData.email)
    ) {
      await checkDuplicateEmail(updateData.email, id, transaction);
    }

    // Check for duplicate username if username is being updated
    if (
      updateData.username &&
      shouldValidateField(record.username, updateData.username)
    ) {
      await checkDuplicateUsername(updateData.username, id, transaction);
    }

    const updateOptions = { ...options } as any;
    if (transaction) {
      updateOptions.transaction = transaction;
    }

    await record.update(updateData as any, updateOptions);

    return {
      success: true,
      data: record,
      message: 'User updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for User', error.message);
    }
    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      throw new ValidationError(
        'Validation failed for User',
        'Username or email already exists'
      );
    }
    throw new ValidationError(
      'Error updating User',
      error instanceof Error ? error.message : String(error)
    );
  }
};
