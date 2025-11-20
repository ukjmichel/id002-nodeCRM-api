/**
 * Count Businesses Service
 * Counts businesses with optional filters
 */

import { BusinessModel } from '../models/business.model.js';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import {
  Attributes,
  CountOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';

/**
 * Count businesses with optional filters
 *
 * @param where - Where clause
 * @param options - Sequelize count options
 * @returns Count result
 * @throws {ValidationError} When count fails
 *
 * @example
 * ```typescript
 * const result = await countBusinesses({ active: true });
 * console.log(`There are ${result.data} active businesses`);
 * ```
 */
export const countBusinesses = async (
  where: WhereOptions<Attributes<BusinessModel>> = {},
  options?: CountOptions
): Promise<ApiResponse<number>> => {
  try {
    const count = await BusinessModel.count({
      where,
      ...options,
    });
    return {
      success: true,
      data: count,
      count,
      message: 'Businesses counted successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error counting Businesses',
      error instanceof Error ? error.message : String(error)
    );
  }
};
