/**
 * Delete Option Group Service
 * Deletes an option group by its MongoDB _id
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';
import { Types } from 'mongoose';

/**
 * Deletes an option group by its MongoDB _id
 *
 * @param id - The MongoDB ObjectId
 * @returns ApiResponse with void data
 * @throws {ValidationError} When ID format is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await deleteOptionGroup('507f1f77bcf86cd799439011');
 * ```
 */
export async function deleteOptionGroup(
  id: string
): Promise<ApiResponse<void>> {
  // Validate MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    throw new ValidationError(
      'Invalid ID format',
      'Invalid MongoDB ObjectId format'
    );
  }

  const result = await OptionGroupModel.findByIdAndDelete(id);

  if (!result) {
    throw new NotFoundError(`Option group with id '${id}' not found`);
  }

  return {
    success: true,
    message: 'Option group deleted successfully',
  };
}
