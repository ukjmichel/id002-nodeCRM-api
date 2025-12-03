/**
 * Replace all items in an Option with a new set of items
 */

import { ItemOptionsModel } from '../../models/item-option.model.js';
import { IItemOptionsDocument } from '../../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Replace all items in an Option with a new set of items
 *
 * @param optionId - Option identifier
 * @param itemIds - New array of business item IDs (must be valid UUIDs)
 * @param defaultMaxQuantity - Default max quantity for new items (default: 1)
 * @param defaultActive - Default active status for new items (default: true)
 * @returns Updated Option with new items
 * @throws {NotFoundError} When Option is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * // Replace with defaults
 * const result = await replaceAllItems(
 *   'size-options-001',
 *   ['550e8400-e29b-41d4-a716-446655440001']
 * );
 *
 * // Replace with custom settings
 * const result = await replaceAllItems(
 *   'size-options-001',
 *   ['550e8400-e29b-41d4-a716-446655440001'],
 *   5,    // maxQuantity
 *   true  // active
 * );
 *
 * // Clear all items by passing empty array
 * const result = await replaceAllItems('size-options-001', []);
 * ```
 */
export const replaceAllItems = async (
  optionId: string,
  itemIds: string[],
  defaultMaxQuantity: number = 1,
  defaultActive: boolean = true
): Promise<ApiResponse<IItemOptionsDocument>> => {
  try {
    // Validate inputs
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    if (!Array.isArray(itemIds)) {
      throw new ValidationError('Invalid itemIds', 'Item IDs must be an array');
    }

    // Validate defaultMaxQuantity
    if (defaultMaxQuantity < 1 || defaultMaxQuantity > 100) {
      throw new ValidationError(
        'Invalid defaultMaxQuantity',
        'Default max quantity must be between 1 and 100'
      );
    }

    // Allow empty array to clear all items
    if (itemIds.length > 0) {
      // Validate all item IDs
      const invalidIds = itemIds.filter((id) => !validateItemId(id));
      if (invalidIds.length > 0) {
        throw new ValidationError(
          'Invalid item ID format',
          `The following item IDs are invalid: ${invalidIds.join(', ')}`
        );
      }
    }

    // Find the Option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    const previousCount = option.items.length;

    // Replace all items with proper IOptionItem structure
    // Remove duplicates via Set, then map to IOptionItem objects
    const uniqueItemIds = [...new Set(itemIds)];
    option.items = uniqueItemIds.map((itemId) => ({
      itemId,
      maxQuantity: defaultMaxQuantity,
      active: defaultActive,
    }));

    await option.save();

    return {
      success: true,
      data: option,
      message: `Replaced ${previousCount} item(s) with ${option.items.length} new item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error replacing items in option',
      error.message || String(error)
    );
  }
};
