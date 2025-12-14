/**
 * Set Item Active Status Service
 * Sets the active status of a specific item in an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Sets the active status of a specific item in an option group
 *
 * @param optionId - The custom optionId
 * @param itemId - The item UUID
 * @param active - The new active status
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group or item not found
 *
 * @example
 * ```typescript
 * // Activate an item
 * const result = await setItemActiveStatus('size-options', 'uuid-1', true);
 *
 * // Deactivate an item
 * const result = await setItemActiveStatus('size-options', 'uuid-1', false);
 * ```
 */
export async function setItemActiveStatus(
  optionId: string,
  itemId: string,
  active: boolean
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

  if (typeof active !== 'boolean') {
    throw new ValidationError(
      'Invalid active status',
      'Active status must be a boolean'
    );
  }

  const optionGroup = await OptionGroupModel.findOneAndUpdate(
    { optionId, 'items.itemId': itemId },
    { $set: { 'items.$.active': active } },
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
    message: `Item ${active ? 'activated' : 'deactivated'} successfully`,
  };
}
