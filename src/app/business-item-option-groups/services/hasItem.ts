/**
 * Check if an option group contains a specific item
 */


import { NotFoundError, ValidationError } from '../../../core/errors';
import { ApiResponse } from '../../../core/interfaces';
import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';


/**
 * Check if an option group contains a specific item
 *
 * @param optionId - Option group identifier
 * @param itemId - Business item ID to check for
 * @returns Boolean indicating if the item is in the group
 * @throws {NotFoundError} When option group is not found
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

    // Find the option group
    const optionGroup = await BusinessItemOptionGroupModel.findByOptionId(
      optionId.trim()
    );

    if (!optionGroup) {
      throw new NotFoundError(
        `Option group with optionId '${optionId}' not found`
      );
    }

    const hasTheItem = optionGroup.hasItem(itemId);

    return {
      success: true,
      data: hasTheItem,
      message: hasTheItem
        ? 'Item exists in option group'
        : 'Item does not exist in option group',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error checking if item exists in option group',
      error.message || String(error)
    );
  }
};
