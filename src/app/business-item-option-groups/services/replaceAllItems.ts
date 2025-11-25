/**
 * Replace all items in an option group with a new set of items
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { validateItemId } from './validateItemId';
import { ApiResponse } from '../../../core/interfaces';
import { NotFoundError, ValidationError } from '../../../core/errors';

/**
 * Replace all items in an option group with a new set of items
 *
 * @param optionId - Option group identifier
 * @param itemIds - New array of business item IDs (must be valid UUIDs)
 * @returns Updated option group with new items
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 */
export const replaceAllItems = async (
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

    // Allow empty array to clear all items
    if (itemIds.length > 0) {
      // Validate all item IDs
      const invalidIds = itemIds.filter((id) => !validateItemId(id));
      if (invalidIds.length > 0) {
        throw new ValidationError(
          'Invalid item ID format',
          `The following item IDs are invalid: ${invalidIds.join(', ')}`
        );
      }
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

    // Replace all items (removes duplicates automatically via Set)
    optionGroup.items = [...new Set(itemIds)];
    await optionGroup.save();

    return {
      success: true,
      data: optionGroup,
      message: `Replaced ${previousCount} item(s) with ${optionGroup.items.length} new item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error replacing items in option group',
      error.message || String(error)
    );
  }
};
