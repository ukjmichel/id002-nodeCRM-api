/**
 * Find Item By Barcode Service
 * Finds a business item by their barcode
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';

import { normalizeBarcode } from '../utils/validation.js';
import { findOneItem } from './findOneItem.js';

/**
 * Find an item by barcode
 * Barcode is automatically normalized (spaces removed)
 *
 * @param barcode - Item barcode
 * @param options - Query options (include)
 * @returns Business item record
 * @throws {NotFoundError} When item is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const item = await findItemByBarcode('0123456789012');
 * console.log(item.data.name);
 * ```
 */
export const findItemByBarcode = async (
  barcode: string,
  options: FindOneOptions = {}
): Promise<ApiResponse<ItemModel>> => {
  try {
    // Validate barcode is provided
    if (!barcode || typeof barcode !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'Barcode is required and must be a string'
      );
    }

    const normalizedBarcode = normalizeBarcode(barcode);

    const result = await findOneItem(
      { barcode: normalizedBarcode },
      options
    );

    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(`Item with barcode ${barcode} not found`);
    }

    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error finding item by barcode',
      error instanceof Error ? error.message : String(error)
    );
  }
};
