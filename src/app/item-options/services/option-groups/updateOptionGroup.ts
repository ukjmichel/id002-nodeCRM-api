/**
 * Update Option Group Service
 * Updates an option group by its MongoDB _id
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import {
  IOptionGroupDocument,
  UpdateOptionGroupInput,
} from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';
import { Types } from 'mongoose';

/**
 * Updates an option group by its MongoDB _id
 *
 * @param id - The MongoDB ObjectId
 * @param data - The update data
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When ID format is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await updateOptionGroup('507f1f77bcf86cd799439011', {
 *   description: 'Updated description',
 *   items: [
 *     { itemId: 'uuid-1', maxQuantity: 5, active: true }
 *   ]
 * });
 * ```
 */
export async function updateOptionGroup(
  id: string,
  data: UpdateOptionGroupInput
): Promise<ApiResponse<IOptionGroupDocument>> {
  // Validate MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    throw new ValidationError(
      'Invalid ID format',
      'Invalid MongoDB ObjectId format'
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

  const optionGroup = await OptionGroupModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!optionGroup) {
    throw new NotFoundError(`Option group with id '${id}' not found`);
  }

  return {
    success: true,
    data: optionGroup,
    message: 'Option group updated successfully',
  };
}
