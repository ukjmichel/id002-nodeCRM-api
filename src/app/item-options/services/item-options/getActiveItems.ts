/**
 * Get all active items from an option
 */

import { ItemOptionsModel } from '../../models/item-option.model.js';
import { IOptionItem } from '../../interfaces/item-option.interface.js';

import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Get all active items from an option
 *
 * @param optionId - Option identifier
 * @returns Array of active items with their configurations
 * @throws {NotFoundError} When option is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await getActiveItems('size-options-001');
 * console.log(result.data);
 * // [
 * //   { itemId: '550e8400-...', maxQuantity: 1, active: true },
 * //   { itemId: '550e8400-...', maxQuantity: 5, active: true }
 * // ]
 * ```
 */
export const getActiveItems = async (
  optionId: string
): Promise<ApiResponse<IOptionItem[]>> => {
  try {
    // Validate inputs
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    // Find the option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    // Get active items using instance method
    const activeItems = option.getActiveItems();

    return {
      success: true,
      data: activeItems,
      count: activeItems.length,
      message: `Found ${activeItems.length} active item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error getting active items',
      error.message || String(error)
    );
  }
};
