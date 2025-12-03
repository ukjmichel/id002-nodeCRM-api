/**
 * Get all Options that contain any of the specified items
 */

import { ItemOptionsModel } from '../../models/item-option.model.js';
import { IItemOptionsDocument } from '../../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * Get all Options that contain any of the specified items
 *
 * @param itemIds - Array of business item IDs to search for
 * @returns Array of Options containing any of the items
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await getOptionsByItems([
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '550e8400-e29b-41d4-a716-446655440002'
 * ]);
 * console.log(result.data); // Array of options containing these items
 * ```
 */
export const getOptionsByItems = async (
  itemIds: string[]
): Promise<ApiResponse<IItemOptionsDocument[]>> => {
  try {
    // Validate inputs
    if (!Array.isArray(itemIds)) {
      throw new ValidationError('Invalid itemIds', 'Item IDs must be an array');
    }

    if (itemIds.length === 0) {
      throw new ValidationError(
        'Empty itemIds array',
        'At least one item ID must be provided'
      );
    }

    // Validate all item IDs
    const invalidIds = itemIds.filter((id) => !validateItemId(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(
        'Invalid item ID format',
        `The following item IDs are invalid: ${invalidIds.join(', ')}`
      );
    }

    // Query Options - search in items.itemId field (not items directly)
    const options = await ItemOptionsModel.find({
      'items.itemId': { $in: itemIds },
    });

    return {
      success: true,
      data: options,
      count: options.length,
      message: `Found ${options.length} option(s)`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching options by items',
      error.message || String(error)
    );
  }
};
