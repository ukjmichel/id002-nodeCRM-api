/**
 * Find One Business Item Service
 * Finds a single business item by criteria
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOneOptions,
  FindOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';

/**
 * Find one business item by criteria
 *
 * @param where - Where clause
 * @param options - Query options (include)
 * @returns Single business item record
 * @throws {NotFoundError} When business item is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const item = await findOneItem({ sku: 'PIZZA-001' });
 * ```
 */
export const findOneItem = async (
  where: WhereOptions<Attributes<ItemModel>>,
  options: FindOneOptions = {}
): Promise<ApiResponse<ItemModel>> => {
  try {
    const { include } = options;

    const queryOptions: FindOptions<Attributes<ItemModel>> = {
      where,
      ...(include && { include }),
    };

    const record = await ItemModel.findOne(queryOptions);

    if (!record) {
      throw new NotFoundError('Business item not found');
    }

    return {
      success: true,
      data: record,
      message: 'Business item retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching Business Item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
