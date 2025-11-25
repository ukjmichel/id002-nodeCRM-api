/**
 * Add multiple items to an option group at once
 */


import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import {
  IBusinessItemOptionGroup,
  IBusinessItemOptionGroupDocument,
} from '../interfaces/business-item-option-group.interface';

import { validateItemId } from './validateItemId';
import { ApiResponse } from '../../../core/interfaces';
import { NotFoundError, ValidationError } from '../../../core/errors';

/**
 * Add multiple items to an option group at once
 *
 * @param optionId - Option group identifier
 * @param itemIds - Array of business item IDs to add (must be valid UUIDs)
 * @returns Updated option group with count of added items
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await addMultipleItemsToGroup(
 *   'size-options-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002',
 *     '550e8400-e29b-41d4-a716-446655440003'
 *   ]
 * );
 * console.log(result.message); // "3 item(s) added to option group successfully"
 * ```
 */
export const addMultipleItemsToGroup = async (
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

    // Validate all item IDs
    const invalidIds = itemIds.filter((id) => !validateItemId(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(
        'Invalid item ID format',
        `The following item IDs are invalid: ${invalidIds.join(', ')}`
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

    // Add all items
    let addedCount = 0;
    itemIds.forEach((itemId) => {
      if (!optionGroup.hasItem(itemId)) {
        optionGroup.addItem(itemId);
        addedCount++;
      }
    });

    await optionGroup.save();

    return {
      success: true,
      data: optionGroup,
      message: `${addedCount} item(s) added to option group successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error adding multiple items to option group',
      error.message || String(error)
    );
  }
};
