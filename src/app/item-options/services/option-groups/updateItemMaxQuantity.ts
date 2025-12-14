/**
 * Update Item Max Quantity Service
 * Updates the max quantity of a specific item in an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Updates the max quantity of a specific item in an option group
 *
 * @param optionId - The custom optionId
 * @param itemId - The item UUID
 * @param maxQuantity - The new max quantity
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group or item not found
 *
 * @example
 * ```typescript
 * const result = await updateItemMaxQuantity('size-options', 'uuid-1', 10);
 * ```
 */
export async function updateItemMaxQuantity(
  optionId: string,
  itemId: string,
  maxQuantity: number
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

  if (typeof maxQuantity !== 'number' || maxQuantity < 0) {
    throw new ValidationError(
      'Invalid maxQuantity',
      'Max quantity must be a non-negative number'
    );
  }

  const optionGroup = await OptionGroupModel.findOneAndUpdate(
    { optionId, 'items.itemId': itemId },
    { $set: { 'items.$.maxQuantity': maxQuantity } },
    { new: true }
  );

  if (!optionGroup) {
    // Check if option group exists
    const exists = await OptionGroupModel.findOne({ optionId });
    if (!exists) {
      throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
    }
    throw new NotFoundError(
      `Item '${itemId}' not found in option group '${optionId}'`
    );
  }

  return {
    success: true,
    data: optionGroup,
    message: 'Item max quantity updated successfully',
  };
}
