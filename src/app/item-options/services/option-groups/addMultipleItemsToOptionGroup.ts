/**
 * Add Multiple Items To Option Group Service
 * Adds multiple items to an option group at once
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Adds multiple items to an option group at once
 *
 * @param optionId - The custom optionId
 * @param itemIds - Array of item UUIDs to add
 * @param defaultMaxQuantity - Default max quantity for all items (default: 1)
 * @param defaultActive - Default active status for all items (default: true)
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await addMultipleItemsToOptionGroup(
 *   'size-options',
 *   ['uuid-1', 'uuid-2', 'uuid-3'],
 *   5,
 *   true
 * );
 * ```
 */
export async function addMultipleItemsToOptionGroup(
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

  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    throw new ValidationError(
      'Invalid itemIds',
      'Item IDs array is required and must not be empty'
    );
  }

  // Find the option group
  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(
      `Option group with optionId '${optionId}' not found`
    );
  }

  // Get existing item IDs
  const existingItemIds = new Set(optionGroup.items.map((item) => item.itemId));

  // Filter out duplicates and add new items
  const newItems = itemIds
    .filter((id) => !existingItemIds.has(id))
    .map((itemId) => ({
      itemId,
      maxQuantity: defaultMaxQuantity,
      active: defaultActive,
    }));

  const skippedCount = itemIds.length - newItems.length;

  // Add new items
  optionGroup.items.push(...newItems);
  await optionGroup.save();

  return {
    success: true,
    data: optionGroup,
    message:
      skippedCount > 0
        ? `Added ${newItems.length} items, skipped ${skippedCount} duplicates`
        : `Added ${newItems.length} items to option group`,
  };
}
