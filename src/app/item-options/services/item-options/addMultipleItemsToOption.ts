/**
 * Add multiple items to an option at once
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
 * Add multiple items to an option at once
 *
 * @param optionId - Option identifier
 * @param itemIds - Array of business item IDs to add (must be valid UUIDs)
 * @param defaultMaxQuantity - Default max quantity for new items (default: 1)
 * @param defaultActive - Default active status for new items (default: true)
 * @returns Updated option with count of added items
 * @throws {NotFoundError} When option is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * // Add items with defaults
 * const result = await addMultipleItemsToOption(
 *   'size-options-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002',
 *     '550e8400-e29b-41d4-a716-446655440003'
 *   ]
 * );
 *
 * // Add items with custom maxQuantity and active status
 * const result = await addMultipleItemsToOption(
 *   'size-options-001',
 *   ['550e8400-e29b-41d4-a716-446655440001'],
 *   3,
 *   true
 * );
 * ```
 */
export const addMultipleItemsToOption = async (
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

    if (itemIds.length === 0) {
      throw new ValidationError(
        'Empty itemIds array',
        'At least one item ID must be provided'
      );
    }

    // Validate defaultMaxQuantity
    if (defaultMaxQuantity < 1 || defaultMaxQuantity > 100) {
      throw new ValidationError(
        'Invalid defaultMaxQuantity',
        'Default max quantity must be between 1 and 100'
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

    // Find the option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    // Add all items using instance method
    let addedCount = 0;
    itemIds.forEach((itemId) => {
      if (!option.hasItem(itemId)) {
        option.addItem(itemId, defaultMaxQuantity, defaultActive);
        addedCount++;
      }
    });

    await option.save();

    return {
      success: true,
      data: option,
      message: `${addedCount} item(s) added to option successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error adding multiple items to option',
      error.message || String(error)
    );
  }
};
