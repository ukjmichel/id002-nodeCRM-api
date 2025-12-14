/**
 * Get Active Items Service
 * Gets all active items from an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupItem } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Gets all active items from an option group
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with array of active items
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await getActiveItems('size-options');
 * console.log(result.data); // [{ itemId: '...', maxQuantity: 5, active: true }, ...]
 * ```
 */
export async function getActiveItems(
  optionId: string
): Promise<ApiResponse<IOptionGroupItem[]>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(
      `Option group with optionId '${optionId}' not found`
    );
  }

  const activeItems = optionGroup.items.filter((item) => item.active);

  return {
    success: true,
    data: activeItems,
    count: activeItems.length,
    message: `Found ${activeItems.length} active items`,
  };
}
