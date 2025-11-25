/**
 * Find all option groups that include a specific item
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { validateItemId } from './validateItemId';
import { ApiResponse } from '../../../core/interfaces';
import { ValidationError } from '../../../core/errors';

/**
 * Find all option groups that include a specific item
 *
 * @param itemId - Business item ID (must be valid UUID)
 * @returns Array of option groups containing the item
 * @throws {ValidationError} When itemId is invalid or query fails
 */
export const findByItemId = async (
  itemId: string
): Promise<ApiResponse<IBusinessItemOptionGroupDocument[]>> => {
  try {
    // Validate item ID format
    if (!validateItemId(itemId)) {
      throw new ValidationError(
        'Invalid item ID format',
        'Item ID must be a valid UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)'
      );
    }

    const optionGroups = await BusinessItemOptionGroupModel.findByItemId(
      itemId
    );

    return {
      success: true,
      data: optionGroups,
      count: optionGroups.length,
      message: `Found ${optionGroups.length} option group(s) for item`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching option groups by item ID',
      error.message || String(error)
    );
  }
};
