/**
 * Add a single item to an option
 */

import { IItemOptionsDocument } from '../../interfaces/item-option.interface.js';

import { validateItemId } from '../validateItemId.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';
import { ItemOptionsModel } from '../../models/item-option.model.js';

/**
 * Add a single item to an option
 *
 * @param optionId - option identifier
 * @param itemId - Business item ID to add (must be valid UUID)
 * @param maxQuantity - Maximum quantity for this item (default: 1)
 * @param active - Whether the item is active (default: true)
 * @returns Updated option
 * @throws {NotFoundError} When option is not found
 * @throws {ValidationError} When item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * // Add item with defaults
 * const result = await addItemToOption(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Add item with custom maxQuantity
 * const result = await addItemToOption(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   5,
 *   true
 * );
 * ```
 */
export const addItemToOption = async (
  optionId: string,
  itemId: string,
  maxQuantity: number = 1,
  active: boolean = true
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

    // Validate maxQuantity
    if (maxQuantity < 1 || maxQuantity > 100) {
      throw new ValidationError(
        'Invalid maxQuantity',
        'Max quantity must be between 1 and 100'
      );
    }

    // Find the option
    const optionOption = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!optionOption) {
      throw new NotFoundError(`option with optionId '${optionId}' not found`);
    }

    // Check if item already exists
    if (optionOption.hasItem(itemId)) {
      return {
        success: true,
        data: optionOption,
        message: 'Item already exists in option',
      };
    }

    // Add item using instance method and save
    optionOption.addItem(itemId, maxQuantity, active);
    await optionOption.save();

    return {
      success: true,
      data: optionOption,
      message: 'Item added to option successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error adding item to option',
      error.message || String(error)
    );
  }
};
