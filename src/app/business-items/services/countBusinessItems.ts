/**
 * Count Business Items Service
 * Counts business items with optional filters
 */

import { BusinessItemModel } from '../models/business-item.model.js';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import {
  Attributes,
  CountOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';

/**
 * Count business items with optional filters
 *
 * @param where - Where clause
 * @param options - Sequelize count options
 * @returns Count result
 * @throws {ValidationError} When count fails
 *
 * @example
 * ```typescript
 * const result = await countBusinessItems({ available: true });
 * console.log(`There are ${result.data} available items`);
 * ```
 */
export const countBusinessItems = async (
  where: WhereOptions<Attributes<BusinessItemModel>> = {},
  options?: CountOptions
): Promise<ApiResponse<number>> => {
  try {
    const count = await BusinessItemModel.count({
      where,
      ...options,
    });
    return {
      success: true,
      data: count,
      count,
      message: 'Business items counted successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error counting Business Items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
