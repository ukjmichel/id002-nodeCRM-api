/**
 * Find Inactive Businesses Service
 * Retrieves all inactive businesses
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { findAllBusinesses } from './findAllBusinesses.js';

/**
 * Find all inactive businesses
 *
 * @returns Array of inactive businesses
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const inactiveBusinesses = await findInactiveBusinesses();
 * console.log(`Found ${inactiveBusinesses.count} inactive businesses`);
 * ```
 */
export const findInactiveBusinesses = async (): Promise<
  ApiResponse<BusinessModel[]>
> => {
  try {
    const result = await findAllBusinesses({
      where: { active: false },
      order: [['closureDate', 'DESC']],
    });

    return {
      ...result,
      message: 'Inactive businesses retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching inactive businesses',
      error instanceof Error ? error.message : String(error)
    );
  }
};
