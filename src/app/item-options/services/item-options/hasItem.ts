/**
 * Check if an Option contains a specific item
 */

import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ItemOptionsModel } from '../../models/item-option.model.js';

/**
 * Check if an Option contains a specific item
 *
 * @param optionId - Option identifier
 * @param itemId - Business item ID to check for
 * @returns Boolean indicating if the item is in the Option
 * @throws {NotFoundError} When Option is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await hasItem(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.data); // true or false
 * ```
 */
export const hasItem = async (
  optionId: string,
  itemId: string
): Promise<ApiResponse<boolean>> => {
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

    // Find the Option
    const optionOption = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!optionOption) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    const hasTheItem = optionOption.hasItem(itemId);

    return {
      success: true,
      data: hasTheItem,
      message: hasTheItem
        ? 'Item exists in Option'
        : 'Item does not exist in Option',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error checking if item exists in Option',
      error.message || String(error)
    );
  }
};
