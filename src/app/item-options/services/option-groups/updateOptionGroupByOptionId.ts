/**
 * Update Option Group By Option ID Service
 * Updates an option group by its custom optionId
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import {
  IOptionGroupDocument,
  UpdateOptionGroupInput,
} from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Updates an option group by its custom optionId
 *
 * @param optionId - The custom optionId
 * @param data - The update data
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await updateOptionGroupByOptionId('size-options', {
 *   description: 'Updated description'
 * });
 * ```
 */
export async function updateOptionGroupByOptionId(
  optionId: string,
  data: UpdateOptionGroupInput
): Promise<ApiResponse<IOptionGroupDocument>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  // Build update object (only include provided fields)
  const updateData: Partial<UpdateOptionGroupInput> = {};

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.items !== undefined) {
    updateData.items = data.items;
  }

  const optionGroup = await OptionGroupModel.findOneAndUpdate(
    { optionId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!optionGroup) {
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  return {
    success: true,
    data: optionGroup,
    message: 'Option group updated successfully',
  };
}
