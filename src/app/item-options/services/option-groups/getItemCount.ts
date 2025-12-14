/**
 * Get Item Count Service
 * Gets the total number of items in an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Gets the total number of items in an option group
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with the item count
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await getItemCount('size-options');
 * console.log(result.data); // 5
 * ```
 */
export async function getItemCount(
  optionId: string
): Promise<ApiResponse<number>> {
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

  const count = optionGroup.items.length;

  return {
    success: true,
    data: count,
    count,
    message: `Option group has ${count} items`,
  };
}
