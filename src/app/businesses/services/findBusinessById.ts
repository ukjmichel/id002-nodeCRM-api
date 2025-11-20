/**
 * Find Business By ID Service
 * Retrieves a single business by their ID
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';

/**
 * Get a single business by ID
 *
 * @param id - Business ID
 * @param options - Query options (include)
 * @returns Single business record
 * @throws {NotFoundError} When business is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const business = await findBusinessById('business-uuid-here');
 * console.log(business.data.legalName);
 * ```
 */
export const findBusinessById = async (
  id: number | string,
  options: FindOneOptions = {}
): Promise<ApiResponse<BusinessModel>> => {
  try {
    const { include } = options;

    const record = await BusinessModel.findByPk(id, {
      ...(include && { include }),
    });

    if (!record) {
      throw new NotFoundError(`Business with ID ${id} not found`);
    }

    return {
      success: true,
      data: record,
      message: 'Business retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching Business',
      error instanceof Error ? error.message : String(error)
    );
  }
};
