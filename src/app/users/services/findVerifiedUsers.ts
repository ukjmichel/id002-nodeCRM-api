/**
 * Find Verified Users Service
 * Retrieves all verified users
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';
import { findAllUsers } from './findAllUsers.js';

/**
 * Find all verified users
 *
 * @returns Array of verified users
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const verifiedUsers = await findVerifiedUsers();
 * console.log(`Found ${verifiedUsers.count} verified users`);
 * ```
 */
export const findVerifiedUsers = async (): Promise<
  ApiResponse<UserModel[]>
> => {
  try {
    const result = await findAllUsers({
      where: { verified: true },
    });

    return {
      ...result,
      message: 'Verified users retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching verified users',
      error instanceof Error ? error.message : String(error)
    );
  }
};
