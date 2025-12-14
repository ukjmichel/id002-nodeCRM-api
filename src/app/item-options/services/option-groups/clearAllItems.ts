/**
 * Clear All Items Service
 * Removes all items from an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Removes all items from an option group
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await clearAllItems('size-options');
 * ```
 */
export async function clearAllItems(
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
    { $set: { items: [] } },
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
    message: 'All items cleared from option group',
  };
}
