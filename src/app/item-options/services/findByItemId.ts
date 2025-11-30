/**
 * Find all options that include a specific item
 */

import { ItemOptionsModel } from '../models/item-option.model.js';
import { IItemOptionsDocument } from '../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ValidationError } from '../../../core/errors/index.js';

/**
 * Find all options that include a specific item
 *
 * @param itemId - Business item ID (must be valid UUID)
 * @returns Array of options containing the item
 * @throws {ValidationError} When itemId is invalid or query fails
 */
export const findByItemId = async (
  itemId: string
): Promise<ApiResponse<IItemOptionsDocument[]>> => {
  try {
    // Validate item ID format
    if (!validateItemId(itemId)) {
      throw new ValidationError(
        'Invalid item ID format',
        'Item ID must be a valid UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)'
      );
    }

    const optionOptions = await ItemOptionsModel.findByItemId(itemId);

    return {
      success: true,
      data: optionOptions,
      count: optionOptions.length,
      message: `Found ${optionOptions.length} option(s) for item`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching options by item ID',
      error.message || String(error)
    );
  }
};
