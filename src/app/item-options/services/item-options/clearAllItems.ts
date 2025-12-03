/**
 * Remove all items from an option
 */

import { ItemOptionsModel } from '../../models/item-option.model.js';
import { IItemOptionsDocument } from '../../interfaces/item-option.interface.js';

import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Remove all items from an option
 *
 * @param optionId - option identifier
 * @returns Updated option with empty items array
 * @throws {NotFoundError} When option is not found
 * @throws {ValidationError} When operation fails
 */
export const clearAllItems = async (
  optionId: string
): Promise<ApiResponse<IItemOptionsDocument>> => {
  try {
    // Validate input
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    // Find the option
    const optionOption = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!optionOption) {
      throw new NotFoundError(`option with optionId '${optionId}' not found`);
    }

    const previousCount = optionOption.items.length;

    // Clear all items and save
    optionOption.items = [];
    await optionOption.save();

    return {
      success: true,
      data: optionOption,
      message: `Cleared ${previousCount} item(s) from option`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error clearing items from option',
      error.message || String(error)
    );
  }
};
