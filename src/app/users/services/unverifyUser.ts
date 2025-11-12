/**
 * Unverify User Service
 * Marks a user as unverified
 */


import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';

import { UserModel } from '../models/user.model.js';
import { updateUser } from './updateUser.js';

/**
 * Mark a user as unverified
 * Sets the verified flag to false
 *
 * @param userId - User's ID
 * @returns Updated user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const unverifiedUser = await unverifyUser('user-uuid-here');
 * console.log(unverifiedUser.data.verified); // false
 * ```
 */
export const unverifyUser = async (
  userId: string
): Promise<ApiResponse<UserModel>> => {
  try {
    const updatedUser = await updateUser(userId, {
      verified: false,
    });

    return {
      ...updatedUser,
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
