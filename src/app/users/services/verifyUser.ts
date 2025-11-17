// src/app/users/services/verifyUser.ts
/**
 * Verify User Service
 * Marks a user as verified
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

/**
 * Mark a user as verified
 * Sets the verified flag to true
 *
 * @param userId - User's ID
 * @returns Updated user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const verifiedUser = await verifyUser('user-uuid-here');
 * console.log(verifiedUser.data.verified); // true
 * ```
 */
export const verifyUser = async (
  userId: string
): Promise<ApiResponse<UserModel>> => {
  try {
    const record = await UserModel.findByPk(userId);

    if (!record) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    await record.update({ verified: true });

    return {
      success: true,
      data: record,
      message: 'User verified successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error verifying user',
      error instanceof Error ? error.message : String(error)
    );
  }
};
