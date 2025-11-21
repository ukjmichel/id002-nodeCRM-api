/**
 * Find Item By Barcode Service
 * Finds a business item by their barcode
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { findOneBusinessItem } from './findOneBusinessItem.js';
import { normalizeBarcode } from '../utils/validation.js';

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
): Promise<ApiResponse<BusinessItemModel>> => {
  try {
    // Validate barcode is provided
    if (!barcode || typeof barcode !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'Barcode is required and must be a string'
      );
    }

    const normalizedBarcode = normalizeBarcode(barcode);

    const result = await findOneBusinessItem({ barcode: normalizedBarcode }, options);

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
