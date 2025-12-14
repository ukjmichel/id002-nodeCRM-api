/**
 * Get Active Item Count Service
 * Gets the number of active items in an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Gets the number of active items in an option group
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with the active item count
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await getActiveItemCount('size-options');
 * console.log(result.data); // 3
 * ```
 */
export async function getActiveItemCount(
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

  const count = optionGroup.items.filter((item) => item.active).length;

  return {
    success: true,
    data: count,
    count,
    message: `Option group has ${count} active items`,
  };
}
