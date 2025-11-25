/**
 * Remove all items from an option group
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { ApiResponse } from '../../../core/interfaces';
import { NotFoundError, ValidationError } from '../../../core/errors';

/**
 * Remove all items from an option group
 *
 * @param optionId - Option group identifier
 * @returns Updated option group with empty items array
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When operation fails
 */
export const clearAllItems = async (
  optionId: string
): Promise<ApiResponse<IBusinessItemOptionGroupDocument>> => {
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

    const previousCount = optionGroup.items.length;

    // Clear all items and save
    optionGroup.items = [];
    await optionGroup.save();

    return {
      success: true,
      data: optionGroup,
      message: `Cleared ${previousCount} item(s) from option group`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error clearing items from option group',
      error.message || String(error)
    );
  }
};
