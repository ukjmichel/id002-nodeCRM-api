/**
 * Remove Multiple Items From Option Group Service
 * Removes multiple items from an option group at once
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Removes multiple items from an option group at once
 *
 * @param optionId - The custom optionId
 * @param itemIds - Array of item UUIDs to remove
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await removeMultipleItemsFromOptionGroup(
 *   'size-options',
 *   ['uuid-1', 'uuid-2']
 * );
 * ```
 */
export async function removeMultipleItemsFromOptionGroup(
  optionId: string,
  itemIds: string[]
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
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  // Create a Set for faster lookup
  const itemIdsToRemove = new Set(itemIds);
  const originalCount = optionGroup.items.length;

  // Filter out items to remove
  optionGroup.items = optionGroup.items.filter(
    (item) => !itemIdsToRemove.has(item.itemId)
  );

  const removedCount = originalCount - optionGroup.items.length;

  await optionGroup.save();

  return {
    success: true,
    data: optionGroup,
    message: `Removed ${removedCount} items from option group`,
  };
}
