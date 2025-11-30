/**
 * Remove multiple items from an Option at once
 */

import { ItemOptionsModel } from '../models/item-option.model.js';
import { IItemOptionsDocument } from '../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Remove multiple items from an Option at once
 *
 * @param optionId - Option identifier
 * @param itemIds - Array of business item IDs to remove (must be valid UUIDs)
 * @returns Updated Option with count of removed items
 * @throws {NotFoundError} When Option is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await removeMultipleItemsFromOption(
 *   'size-options-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002'
 *   ]
 * );
 * console.log(result.message); // "2 item(s) removed from option successfully"
 * ```
 */
export const removeMultipleItemsFromOption = async (
  optionId: string,
  itemIds: string[]
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

    // Validate all item IDs
    const invalidIds = itemIds.filter((id) => !validateItemId(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(
        'Invalid item ID format',
        `The following item IDs are invalid: ${invalidIds.join(', ')}`
      );
    }

    // Find the Option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    // Remove all items and count removed
    let removedCount = 0;
    itemIds.forEach((itemId) => {
      if (option.hasItem(itemId)) {
        option.removeItem(itemId);
        removedCount++;
      }
    });

    await option.save();

    return {
      success: true,
      data: option,
      message: `${removedCount} item(s) removed from option successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing multiple items from option',
      error.message || String(error)
    );
  }
};
