/**
 * Remove multiple items from an option group at once
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { ApiResponse } from '../../../core/interfaces';
import { NotFoundError, ValidationError } from '../../../core/errors';

/**
 * Remove multiple items from an option group at once
 *
 * @param optionId - Option group identifier
 * @param itemIds - Array of business item IDs to remove
 * @returns Updated option group
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When operation fails
 */
export const removeMultipleItemsFromGroup = async (
  optionId: string,
  itemIds: string[]
): Promise<ApiResponse<IBusinessItemOptionGroupDocument>> => {
  try {
    // Validate inputs
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    if (!Array.isArray(itemIds)) {
      throw new ValidationError('Invalid itemIds', 'Item IDs must be an array');
    }

    if (itemIds.length === 0) {
      throw new ValidationError(
        'Empty itemIds array',
        'At least one item ID must be provided'
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

    // Remove all items
    itemIds.forEach((itemId) => {
      optionGroup.removeItem(itemId);
    });

    await optionGroup.save();

    return {
      success: true,
      data: optionGroup,
      message: 'Items removed from option group successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing multiple items from option group',
      error.message || String(error)
    );
  }
};
