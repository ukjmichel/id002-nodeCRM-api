/**
 * Find Businesses By SIREN Service
 * Finds all businesses (establishments) with the same SIREN number with validation
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { findAllBusinesses } from './findAllBusinesses.js';

/**
 * Find all businesses with the same SIREN
 * A SIREN identifies a legal entity which can have multiple establishments (SIRET)
 * SIREN is automatically normalized (spaces removed)
 *
 * @param siren - Business SIREN number (9 digits)
 * @returns Array of business records
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const establishments = await findBusinessesBySiren('123456789');
 * console.log(`Found ${establishments.count} establishments`);
 * ```
 */
export const findBusinessesBySiren = async (
  siren: string
): Promise<ApiResponse<BusinessModel[]>> => {
  try {
    // ========================================================================
    // PRE-DATABASE VALIDATION
    // ========================================================================

    // Validate SIREN is provided
    if (!siren || typeof siren !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'SIREN is required and must be a string'
      );
    }

    // Normalize SIREN (remove spaces and other non-digit characters)
    const normalizedSiren = siren.replace(/\s+/g, '');

    // Validate SIREN length (should be 9 digits)
    if (normalizedSiren.length !== 9) {
      throw new ValidationError(
        'Validation failed',
        'SIREN must be exactly 9 digits'
      );
    }

    // Validate SIREN contains only digits
    if (!/^\d{9}$/.test(normalizedSiren)) {
      throw new ValidationError(
        'Validation failed',
        'SIREN must contain only numbers'
      );
    }

    // ========================================================================
    // DATABASE OPERATION
    // ========================================================================

    const result = await findAllBusinesses({
      where: { siren: normalizedSiren },
      order: [['createdAt', 'DESC']],
    });

    return {
      ...result,
      message:
        result.count === 0
          ? `No businesses found with SIREN ${siren}`
          : `Found ${result.count} business(es) with SIREN ${siren}`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      `Error fetching businesses with SIREN ${siren}`,
      error instanceof Error ? error.message : String(error)
    );
  }
};
