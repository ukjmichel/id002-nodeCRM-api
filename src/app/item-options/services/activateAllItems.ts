/**
 * Activate all items in an option
 */

import { ItemOptionsModel } from '../models/item-option.model.js';
import { IItemOptionsDocument } from '../interfaces/item-option.interface.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Activate all items in an option
 * Sets active=true for all items
 *
 * @param optionId - Option identifier
 * @returns Updated option with all items activated
 * @throws {NotFoundError} When option is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await activateAllItems('size-options-001');
 * console.log(result.message); // "5 item(s) activated successfully"
 * ```
 */
export const activateAllItems = async (
  optionId: string
): Promise<ApiResponse<IItemOptionsDocument>> => {
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

    // Activate all items
    let activatedCount = 0;
    option.items.forEach((item) => {
      if (!item.active) {
        item.active = true;
        activatedCount++;
      }
    });

    await option.save();

    return {
      success: true,
      data: option,
      message: `${activatedCount} item(s) activated successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error activating all items',
      error.message || String(error)
    );
  }
};
