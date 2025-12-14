/**
 * Activate All Items Service
 * Activates all items in an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Activates all items in an option group
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await activateAllItems('size-options');
 * ```
 */
export async function activateAllItems(
  optionId: string
): Promise<ApiResponse<IOptionGroupDocument>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  const optionGroup = await OptionGroupModel.findOneAndUpdate(
    { optionId },
    { $set: { 'items.$[].active': true } },
    { new: true }
  );

  if (!optionGroup) {
    throw new NotFoundError(
      `Option group with optionId '${optionId}' not found`
    );
  }

  return {
    success: true,
    data: optionGroup,
    message: 'All items activated successfully',
  };
}
