/**
 * Get the number of items in an option group
 */


import { NotFoundError, ValidationError } from '../../../core/errors';
import { ApiResponse } from '../../../core/interfaces';
import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';


/**
 * Get the number of items in an option group
 *
 * @param optionId - Option group identifier
 * @returns Count of items in the group
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await getItemCount('size-options-001');
 * console.log(`This group has ${result.data} items`);
 * ```
 */
export const getItemCount = async (
  optionId: string
): Promise<ApiResponse<number>> => {
  try {
    // Validate input
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
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

    const itemCount = optionGroup.getItemCount();

    return {
      success: true,
      data: itemCount,
      count: itemCount,
      message: `Option group contains ${itemCount} item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error getting item count from option group',
      error.message || String(error)
    );
  }
};
