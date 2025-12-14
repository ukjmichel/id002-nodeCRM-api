/**
 * Add Item To Option Group Service
 * Adds a single item to an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Adds a single item to an option group
 *
 * @param optionId - The custom optionId
 * @param itemId - The item UUID to add
 * @param maxQuantity - Maximum quantity (default: 1)
 * @param active - Whether the item is active (default: true)
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid or item already exists
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await addItemToOptionGroup(
 *   'size-options',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   3,
 *   true
 * );
 * ```
 */
export async function addItemToOptionGroup(
  optionId: string,
  itemId: string,
  maxQuantity: number = 1,
  active: boolean = true
): Promise<ApiResponse<IOptionGroupDocument>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  if (!itemId || typeof itemId !== 'string') {
    throw new ValidationError(
      'Invalid itemId',
      'Item ID is required and must be a string'
    );
  }

  // Find the option group
  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(
      `Option group with optionId '${optionId}' not found`
    );
  }

  // Check if item already exists
  const existingItem = optionGroup.items.find((item) => item.itemId === itemId);
  if (existingItem) {
    throw new ValidationError(
      'Duplicate item',
      `Item '${itemId}' already exists in this option group`
    );
  }

  // Add the item
  optionGroup.items.push({
    itemId,
    maxQuantity,
    active,
  });

  await optionGroup.save();

  return {
    success: true,
    data: optionGroup,
    message: 'Item added to option group successfully',
  };
}
