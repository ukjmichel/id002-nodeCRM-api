/**
 * Set the active status of an item in an option
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
 * Set the active status of an item in an option
 *
 * @param optionId - Option identifier
 * @param itemId - Business item ID to update
 * @param active - New active status
 * @returns Updated option
 * @throws {NotFoundError} When option or item is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * // Deactivate an item
 * const result = await setItemActiveStatus(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   false
 * );
 *
 * // Activate an item
 * const result = await setItemActiveStatus(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   true
 * );
 * ```
 */
export const setItemActiveStatus = async (
  optionId: string,
  itemId: string,
  active: boolean
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

    if (typeof active !== 'boolean') {
      throw new ValidationError(
        'Invalid active status',
        'Active status must be a boolean'
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

    // Update active status using instance method
    option.setItemActive(itemId, active);
    await option.save();

    return {
      success: true,
      data: option,
      message: `Item ${active ? 'activated' : 'deactivated'} successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating item active status',
      error.message || String(error)
    );
  }
};
