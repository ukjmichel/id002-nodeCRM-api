/**
 * Remove a single item from an option group
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { ApiResponse } from '../../../core/interfaces';
import { NotFoundError, ValidationError } from '../../../core/errors';

/**
 * Remove a single item from an option group
 *
 * @param optionId - Option group identifier
 * @param itemId - Business item ID to remove
 * @returns Updated option group
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When operation fails
 */
export const removeItemFromGroup = async (
  optionId: string,
  itemId: string
): Promise<ApiResponse<IBusinessItemOptionGroupDocument>> => {
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

    // Remove item and save
    optionGroup.removeItem(itemId);
    await optionGroup.save();

    return {
      success: true,
      data: optionGroup,
      message: 'Item removed from option group successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing item from option group',
      error.message || String(error)
    );
  }
};
