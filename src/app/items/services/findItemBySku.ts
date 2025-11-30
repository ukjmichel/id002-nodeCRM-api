/**
 * Find Item By SKU Service
 * Finds a business item by their SKU
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';

import { normalizeSku } from '../utils/validation.js';
import { findOneItem } from './findOneItem.js';

/**
 * Find an item by SKU
 * SKU is automatically normalized (uppercase, trimmed)
 *
 * @param sku - Item SKU
 * @param options - Query options (include)
 * @returns Business item record
 * @throws {NotFoundError} When item is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const item = await findItemBySku('PIZZA-001');
 * console.log(item.data.name);
 * ```
 */
export const findItemBySku = async (
  sku: string,
  options: FindOneOptions = {}
): Promise<ApiResponse<ItemModel>> => {
  try {
    // Validate SKU is provided
    if (!sku || typeof sku !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'SKU is required and must be a string'
      );
    }

    const normalizedSku = normalizeSku(sku);

    const result = await findOneItem({ sku: normalizedSku }, options);

    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(`Item with SKU ${sku} not found`);
    }

    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error finding item by SKU',
      error instanceof Error ? error.message : String(error)
    );
  }
};
