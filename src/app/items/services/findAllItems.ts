/**
 * Find All Business Items Service
 * Retrieves all business items with optional filters and pagination
 */

import { ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOptions,
} from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';

/**
 * Get all business items with optional filters and pagination
 *
 * @param options - Query options (where, limit, offset, order, include)
 * @returns Array of business items with count
 * @throws {ValidationError} When query options are invalid
 *
 * @example
 * ```typescript
 * const items = await findAllItems({
 *   where: { available: true, isVegan: true },
 *   limit: 10,
 *   offset: 0,
 *   order: [['displayOrder', 'ASC']]
 * });
 * ```
 */
export const findAllItems = async (
  options: FindOptions<Attributes<ItemModel>> = {}
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    const { where, limit, offset, order, include } = options;

    const queryOptions: FindOptions<Attributes<ItemModel>> = {
      ...(where && { where }),
      ...(limit && { limit }),
      ...(offset && { offset }),
      ...(order && { order }),
      ...(include && { include }),
    };

    const records = await ItemModel.findAll(queryOptions);
    const count = await ItemModel.count({ where: where || {} });

    return {
      success: true,
      data: records,
      count,
      message: 'Business items retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching Business Items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
