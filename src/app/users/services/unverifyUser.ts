// src/app/users/services/unverifyUser.ts
/**
 * Unverify User Service
 * Marks a user as unverified
 */

import { Transaction } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

/**
 * Mark a user as unverified
 * Sets the verified flag to false
 *
 * @param userId - User's ID
 * @param transaction - Optional transaction object
 * @returns Updated user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * // Without transaction
 * const unverifiedUser = await unverifyUser('user-uuid-here');
 * console.log(unverifiedUser.data.verified); // false
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   const user = await unverifyUser('user-uuid-here', t);
 *   // Other operations...
 * });
 * ```
 */
export const unverifyUser = async (
  userId: string,
  transaction?: Transaction
): Promise<ApiResponse<UserModel>> => {
  try {
    const record = await UserModel.findByPk(userId, { transaction });

    if (!record) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    const updateOptions: any = { verified: false };
    const sequelizeOptions: any = {};
    if (transaction) {
      sequelizeOptions.transaction = transaction;
    }

    await record.update(updateOptions, sequelizeOptions);

    return {
      success: true,
      data: record,
      message: 'User unverified successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error unverifying user',
      error instanceof Error ? error.message : String(error)
    );
  }
};
