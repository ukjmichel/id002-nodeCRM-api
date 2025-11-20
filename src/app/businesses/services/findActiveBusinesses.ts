/**
 * Find Active Businesses Service
 * Retrieves all active businesses
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { findAllBusinesses } from './findAllBusinesses.js';

/**
 * Find all active businesses
 *
 * @returns Array of active businesses
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const activeBusinesses = await findActiveBusinesses();
 * console.log(`Found ${activeBusinesses.count} active businesses`);
 * ```
 */
export const findActiveBusinesses = async (): Promise<
  ApiResponse<BusinessModel[]>
> => {
  try {
    const result = await findAllBusinesses({
      where: { active: true },
      order: [['createdAt', 'DESC']],
    });

    return {
      ...result,
      message: 'Active businesses retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching active businesses',
      error instanceof Error ? error.message : String(error)
    );
  }
};
