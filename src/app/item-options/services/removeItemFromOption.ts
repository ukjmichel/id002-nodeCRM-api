/**
 * Remove a single item from an Option
 */

import { ItemOptionsModel } from '../models/item-option.model.js';
import { IItemOptionsDocument } from '../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Remove a single item from an Option
 *
 * @param optionId - Option identifier
 * @param itemId - Business item ID to remove (must be valid UUID)
 * @returns Updated Option
 * @throws {NotFoundError} When Option is not found
 * @throws {ValidationError} When item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await removeItemFromOption(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * ```
 */
export const removeItemFromOption = async (
  optionId: string,
  itemId: string
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

    // Find the Option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    // Check if item exists before removing
    const hadItem = option.hasItem(itemId);

    // Remove item using instance method and save
    option.removeItem(itemId);
    await option.save();

    return {
      success: true,
      data: option,
      message: hadItem
        ? 'Item removed from option successfully'
        : 'Item was not in option',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing item from option',
      error.message || String(error)
    );
  }
};
