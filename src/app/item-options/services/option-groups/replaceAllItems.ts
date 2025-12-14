/**
 * Replace All Items Service
 * Replaces all items in an option group with a new set
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Replaces all items in an option group with a new set
 *
 * @param optionId - The custom optionId
 * @param itemIds - Array of new item UUIDs
 * @param defaultMaxQuantity - Default max quantity for all items (default: 1)
 * @param defaultActive - Default active status for all items (default: true)
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await replaceAllItems(
 *   'size-options',
 *   ['uuid-1', 'uuid-2'],
 *   3,
 *   true
 * );
 * ```
 */
export async function replaceAllItems(
  optionId: string,
  itemIds: string[],
  defaultMaxQuantity: number = 1,
  defaultActive: boolean = true
): Promise<ApiResponse<IOptionGroupDocument>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  if (!Array.isArray(itemIds)) {
    throw new ValidationError(
      'Invalid itemIds',
      'Item IDs must be an array'
    );
  }

  // Remove duplicates
  const uniqueItemIds = [...new Set(itemIds)];

  // Create new items array
  const newItems = uniqueItemIds.map((itemId) => ({
    itemId,
    maxQuantity: defaultMaxQuantity,
    active: defaultActive,
  }));

  const optionGroup = await OptionGroupModel.findOneAndUpdate(
    { optionId },
    { $set: { items: newItems } },
    { new: true, runValidators: true }
  );

  if (!optionGroup) {
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  return {
    success: true,
    data: optionGroup,
    message: `Replaced items with ${newItems.length} new items`,
  };
}
