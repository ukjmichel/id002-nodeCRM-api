/**
 * Update Option Group Description Service
 * Updates only the description of an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Updates only the description of an option group
 *
 * @param optionId - The custom optionId
 * @param description - The new description
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When optionId or description is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await updateOptionGroupDescription(
 *   'size-options',
 *   'Updated size options description'
 * );
 * ```
 */
export async function updateOptionGroupDescription(
  optionId: string,
  description: string
): Promise<ApiResponse<IOptionGroupDocument>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  if (!description || typeof description !== 'string') {
    throw new ValidationError(
      'Invalid description',
      'Description is required and must be a string'
    );
  }

  const optionGroup = await OptionGroupModel.findOneAndUpdate(
    { optionId },
    { $set: { description } },
    { new: true, runValidators: true }
  );

  if (!optionGroup) {
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  return {
    success: true,
    data: optionGroup,
    message: 'Option group description updated successfully',
  };
}
