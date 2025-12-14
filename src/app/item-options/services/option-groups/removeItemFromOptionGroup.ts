/**
 * Remove Item From Option Group Service
 * Removes a single item from an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Removes a single item from an option group
 *
 * @param optionId - The custom optionId
 * @param itemId - The item UUID to remove
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group or item not found
 *
 * @example
 * ```typescript
 * const result = await removeItemFromOptionGroup(
 *   'size-options',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * ```
 */
export async function removeItemFromOptionGroup(
  optionId: string,
  itemId: string
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
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  // Check if item exists
  const itemIndex = optionGroup.items.findIndex((item) => item.itemId === itemId);
  if (itemIndex === -1) {
    throw new NotFoundError(
      `Item '${itemId}' not found in option group '${optionId}'`
    );
  }

  // Remove the item
  optionGroup.items.splice(itemIndex, 1);
  await optionGroup.save();

  return {
    success: true,
    data: optionGroup,
    message: 'Item removed from option group successfully',
  };
}
