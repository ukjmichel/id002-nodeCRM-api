/**
 * Find Businesses By User ID Service
 * Finds all businesses owned by a specific user
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { findAllBusinesses } from './findAllBusinesses.js';

/**
 * Find all businesses owned by a user
 *
 * @param userId - User ID
 * @returns Array of business records
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const userBusinesses = await findBusinessesByUserId('user-uuid-here');
 * console.log(`User has ${userBusinesses.count} businesses`);
 * ```
 */
export const findBusinessesByUserId = async (
  userId: string
): Promise<ApiResponse<BusinessModel[]>> => {
  try {
    const result = await findAllBusinesses({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return {
      ...result,
      message: 'User businesses retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching user businesses',
      error instanceof Error ? error.message : String(error)
    );
  }
};
