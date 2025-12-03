/**
 * Get the number of items in an Option
 */

import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ItemOptionsModel } from '../../models/item-option.model.js';

/**
 * Get the number of items in an Option
 *
 * @param optionId - Option identifier
 * @returns Count of items in the Option
 * @throws {NotFoundError} When Option is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await getItemCount('size-options-001');
 * console.log(`This Option has ${result.data} items`);
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

    // Find the Option
    const optionOption = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!optionOption) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    const itemCount = optionOption.getItemCount();

    return {
      success: true,
      data: itemCount,
      count: itemCount,
      message: `Option contains ${itemCount} item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error getting item count from Option',
      error.message || String(error)
    );
  }
};
