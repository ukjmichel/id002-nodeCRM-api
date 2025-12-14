/**
 * Get All Items Service
 * Gets all items from an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupItem } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Gets all items from an option group
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with array of all items
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await getAllItems('size-options');
 * console.log(result.data); // [{ itemId: '...', maxQuantity: 5, active: true }, ...]
 * ```
 */
export async function getAllItems(
  optionId: string
): Promise<ApiResponse<IOptionGroupItem[]>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  return {
    success: true,
    data: optionGroup.items,
    count: optionGroup.items.length,
    message: `Found ${optionGroup.items.length} items`,
  };
}
