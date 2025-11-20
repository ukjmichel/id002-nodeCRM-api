/**
 * Find All Businesses Service
 * Retrieves all businesses with optional filters and pagination
 */

import { ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOptions,
} from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';

/**
 * Get all businesses with optional filters and pagination
 *
 * @param options - Query options (where, limit, offset, order, include)
 * @returns Array of businesses with count
 * @throws {ValidationError} When query options are invalid
 *
 * @example
 * ```typescript
 * const businesses = await findAllBusinesses({
 *   where: { active: true, legalForm: 'SARL' },
 *   limit: 10,
 *   offset: 0,
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export const findAllBusinesses = async (
  options: FindOptions<Attributes<BusinessModel>> = {}
): Promise<ApiResponse<BusinessModel[]>> => {
  try {
    const { where, limit, offset, order, include } = options;

    const queryOptions: FindOptions<Attributes<BusinessModel>> = {
      ...(where && { where }),
      ...(limit && { limit }),
      ...(offset && { offset }),
      ...(order && { order }),
      ...(include && { include }),
    };

    const records = await BusinessModel.findAll(queryOptions);
    const count = await BusinessModel.count({ where: where || {} });

    return {
      success: true,
      data: records,
      count,
      message: 'Businesses retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching Businesses',
      error instanceof Error ? error.message : String(error)
    );
  }
};
