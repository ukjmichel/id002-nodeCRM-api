/**
 * Delete Option Group By Option ID Service
 * Deletes an option group by its custom optionId
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Deletes an option group by its custom optionId
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with void data
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await deleteOptionGroupByOptionId('size-options');
 * ```
 */
export async function deleteOptionGroupByOptionId(
  optionId: string
): Promise<ApiResponse<void>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  const result = await OptionGroupModel.findOneAndDelete({ optionId });

  if (!result) {
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  return {
    success: true,
    message: 'Option group deleted successfully',
  };
}
