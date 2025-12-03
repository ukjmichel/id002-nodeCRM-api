/**
 * Get details of a specific item in an option
 */

import { ItemOptionsModel } from '../../models/item-option.model.js';
import { IOptionItem } from '../../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Get details of a specific item in an option
 *
 * @param optionId - Option identifier
 * @param itemId - Business item ID to get details for
 * @returns Item configuration details
 * @throws {NotFoundError} When option or item is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await getItemDetails(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.data);
 * // { itemId: '550e8400-...', maxQuantity: 5, active: true }
 * ```
 */
export const getItemDetails = async (
  optionId: string,
  itemId: string
): Promise<ApiResponse<IOptionItem>> => {
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

    // Find the option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    // Get item details using instance method
    const item = option.getItem(itemId);

    if (!item) {
      throw new NotFoundError(
        `Item with itemId '${itemId}' not found in option`
      );
    }

    return {
      success: true,
      data: item,
      message: 'Item details retrieved successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error getting item details',
      error.message || String(error)
    );
  }
};
