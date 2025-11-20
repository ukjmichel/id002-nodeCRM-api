/**
 * Find Businesses By Legal Form Service
 * Finds all businesses with a specific legal form
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { findAllBusinesses } from './findAllBusinesses.js';

/**
 * Find all businesses with a specific legal form
 *
 * @param legalForm - Legal form (SARL, SAS, SA, etc.)
 * @returns Array of business records
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const sarlBusinesses = await findBusinessesByLegalForm('SARL');
 * console.log(`Found ${sarlBusinesses.count} SARL businesses`);
 * ```
 */
export const findBusinessesByLegalForm = async (
  legalForm: string
): Promise<ApiResponse<BusinessModel[]>> => {
  try {
    const result = await findAllBusinesses({
      where: { legalForm },
      order: [['createdAt', 'DESC']],
    });

    return {
      ...result,
      message: `Businesses with legal form ${legalForm} retrieved successfully`,
    };
  } catch (error) {
    throw new ValidationError(
      `Error fetching businesses with legal form ${legalForm}`,
      error instanceof Error ? error.message : String(error)
    );
  }
};
