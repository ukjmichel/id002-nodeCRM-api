/**
 * Find Unverified Users Service
 * Retrieves all unverified users
 */


import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';
import { findAllUsers } from './findAllUsers.js';


/**
 * Find all unverified users
 *
 * @returns Array of unverified users
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const unverifiedUsers = await findUnverifiedUsers();
 * console.log(`Found ${unverifiedUsers.count} unverified users`);
 * ```
 */
export const findUnverifiedUsers = async (): Promise<
  ApiResponse<UserModel[]>
> => {
  try {
    const result = await findAllUsers({
      where: { verified: false },
    });

    return {
      ...result,
      message: 'Unverified users retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching unverified users',
      error instanceof Error ? error.message : String(error)
    );
  }
};
