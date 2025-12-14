/**
 * Find Option Group By ID Service
 * Retrieves an option group by its MongoDB _id
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';
import { Types } from 'mongoose';

/**
 * Retrieves an option group by its MongoDB _id
 *
 * @param id - The MongoDB ObjectId
 * @returns ApiResponse with the option group
 * @throws {ValidationError} When ID format is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await findOptionGroupById('507f1f77bcf86cd799439011');
 * ```
 */
export async function findOptionGroupById(
  id: string
): Promise<ApiResponse<IOptionGroupDocument>> {
  // Validate MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    throw new ValidationError(
      'Invalid ID format',
      'Invalid MongoDB ObjectId format'
    );
  }

  const optionGroup = await OptionGroupModel.findById(id);

  if (!optionGroup) {
    throw new NotFoundError(`Option group with id '${id}' not found`);
  }

  return {
    success: true,
    data: optionGroup,
    message: 'Option group found successfully',
  };
}
