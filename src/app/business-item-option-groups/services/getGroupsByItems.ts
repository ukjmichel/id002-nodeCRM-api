/**
 * Get all option groups that contain any of the specified items
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { validateItemId } from './validateItemId';
import { ApiResponse } from '../../../core/interfaces';
import { ValidationError } from '../../../core/errors';

/**
 * Get all option groups that contain any of the specified items
 *
 * @param itemIds - Array of business item IDs to search for
 * @returns Array of option groups containing any of the items
 * @throws {ValidationError} When any item ID is invalid or operation fails
 */
export const getGroupsByItems = async (
  itemIds: string[]
): Promise<ApiResponse<IBusinessItemOptionGroupDocument[]>> => {
  try {
    // Validate inputs
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

    // Query option groups
    const optionGroups = await BusinessItemOptionGroupModel.find({
      items: { $in: itemIds },
    });

    return {
      success: true,
      data: optionGroups,
      count: optionGroups.length,
      message: `Found ${optionGroups.length} option group(s)`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching option groups by items',
      error.message || String(error)
    );
  }
};
