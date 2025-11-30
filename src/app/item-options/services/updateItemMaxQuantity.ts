/**
 * Update the max quantity of an item in an option
 */

import { ItemOptionsModel } from '../models/item-option.model.js';
import { IItemOptionsDocument } from '../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Update the max quantity of an item in an option
 *
 * @param optionId - Option identifier
 * @param itemId - Business item ID to update
 * @param maxQuantity - New max quantity value (1-100)
 * @returns Updated option
 * @throws {NotFoundError} When option or item is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await updateItemMaxQuantity(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   5
 * );
 * ```
 */
export const updateItemMaxQuantity = async (
  optionId: string,
  itemId: string,
  maxQuantity: number
): Promise<ApiResponse<IItemOptionsDocument>> => {
  try {
    // Validate inputs
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    if (!itemId || itemId.trim().length === 0) {
      throw new ValidationError('Invalid itemId', 'Item ID cannot be empty');
    }

    if (!validateItemId(itemId)) {
      throw new ValidationError(
        'Invalid item ID format',
        'Item ID must be a valid UUID'
      );
    }

    if (typeof maxQuantity !== 'number' || !Number.isInteger(maxQuantity)) {
      throw new ValidationError(
        'Invalid maxQuantity',
        'Max quantity must be an integer'
      );
    }

    if (maxQuantity < 1 || maxQuantity > 100) {
      throw new ValidationError(
        'Invalid maxQuantity',
        'Max quantity must be between 1 and 100'
      );
    }

    // Find the option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    // Check if item exists
    if (!option.hasItem(itemId)) {
      throw new NotFoundError(
        `Item with itemId '${itemId}' not found in option`
      );
    }

    // Update max quantity using instance method
    option.updateMaxQuantity(itemId, maxQuantity);
    await option.save();

    return {
      success: true,
      data: option,
      message: `Max quantity updated to ${maxQuantity} successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating item max quantity',
      error.message || String(error)
    );
  }
};
