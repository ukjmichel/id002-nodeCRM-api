/**
 * Get Item Details Service
 * Gets details of a specific item in an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupItem } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Gets details of a specific item in an option group
 *
 * @param optionId - The custom optionId
 * @param itemId - The item UUID
 * @returns ApiResponse with the item details
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group or item not found
 *
 * @example
 * ```typescript
 * const result = await getItemDetails('size-options', 'uuid-1');
 * console.log(result.data); // { itemId: 'uuid-1', maxQuantity: 5, active: true }
 * ```
 */
export async function getItemDetails(
  optionId: string,
  itemId: string
): Promise<ApiResponse<IOptionGroupItem>> {
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

  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  const item = optionGroup.items.find((i) => i.itemId === itemId);

  if (!item) {
    throw new NotFoundError(
      `Item '${itemId}' not found in option group '${optionId}'`
    );
  }

  return {
    success: true,
    data: item,
    message: 'Item details retrieved successfully',
  };
}
