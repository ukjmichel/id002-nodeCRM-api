/**
 * Add a single item to an option group
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
 * Add a single item to an option group
 *
 * @param optionId - Option group identifier
 * @param itemId - Business item ID to add (must be valid UUID)
 * @returns Updated option group
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await addItemToGroup(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.message); // "Item added to option group successfully"
 * ```
 */
export const addItemToGroup = async (
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

    if (!validateItemId(itemId)) {
      throw new ValidationError(
        'Invalid item ID format',
        'Item ID must be a valid UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)'
      );
    }

    // Find the option group using the static method
    const optionGroup = await BusinessItemOptionGroupModel.findByOptionId(
      optionId.trim()
    );

    if (!optionGroup) {
      throw new NotFoundError(
        `Option group with optionId '${optionId}' not found`
      );
    }

    // Check if item already exists
    if (optionGroup.hasItem(itemId)) {
      return {
        success: true,
        data: optionGroup,
        message: 'Item already exists in option group',
      };
    }

    // Add item and save
    optionGroup.addItem(itemId);
    await optionGroup.save();

    return {
      success: true,
      data: optionGroup,
      message: 'Item added to option group successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error adding item to option group',
      error.message || String(error)
    );
  }
};
