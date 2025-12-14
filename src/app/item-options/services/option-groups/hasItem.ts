/**
 * Has Item Service
 * Checks if an option group contains a specific item
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Checks if an option group contains a specific item
 *
 * @param optionId - The custom optionId
 * @param itemId - The item UUID to check
 * @returns ApiResponse with boolean indicating if item exists
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await hasItem('size-options', 'uuid-1');
 * if (result.data) {
 *   console.log('Item exists in option group');
 * }
 * ```
 */
export async function hasItem(
  optionId: string,
  itemId: string
): Promise<ApiResponse<boolean>> {
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

  const exists = optionGroup.items.some((item) => item.itemId === itemId);

  return {
    success: true,
    data: exists,
    message: exists
      ? `Item '${itemId}' exists in option group`
      : `Item '${itemId}' does not exist in option group`,
  };
}
