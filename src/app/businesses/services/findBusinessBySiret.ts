/**
 * Find Business By SIRET Service
 * Finds a business by their SIRET number with validation
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  FindOneOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';
import { BusinessAttributes } from '../interfaces/business.interface.js';
import { BusinessModel } from '../models/business.model.js';
import { findOneBusiness } from './findOneBusiness.js';

/**
 * Find a business by SIRET number
 * SIRET is automatically normalized (spaces removed)
 *
 * @param siret - Business SIRET number (14 digits)
 * @param options - Query options (include)
 * @returns Business record
 * @throws {NotFoundError} When business is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const business = await findBusinessBySiret('12345678901234');
 * console.log(business.data.legalName);
 * ```
 */
export const findBusinessBySiret = async (
  siret: string,
  options: FindOneOptions = {}
): Promise<ApiResponse<BusinessModel>> => {
  try {
    // ========================================================================
    // PRE-DATABASE VALIDATION
    // ========================================================================

    // Validate SIRET is provided
    if (!siret || typeof siret !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'SIRET is required and must be a string'
      );
    }

    // Normalize SIRET (remove spaces and other non-digit characters)
    const normalizedSiret = siret.replace(/\s+/g, '');

    // Validate SIRET length (should be 14 digits)
    if (normalizedSiret.length !== 14) {
      throw new ValidationError(
        'Validation failed',
        'SIRET must be exactly 14 digits'
      );
    }

    // Validate SIRET contains only digits
    if (!/^\d{14}$/.test(normalizedSiret)) {
      throw new ValidationError(
        'Validation failed',
        'SIRET must contain only numbers'
      );
    }

    // ========================================================================
    // DATABASE OPERATION
    // ========================================================================

    const where: WhereOptions<BusinessAttributes> = { siret: normalizedSiret };

    return await findOneBusiness(where, options);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(`Business with SIRET ${siret} not found`);
    }

    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error finding business by SIRET',
      error instanceof Error ? error.message : String(error)
    );
  }
};
