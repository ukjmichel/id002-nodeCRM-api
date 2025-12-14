/**
 * Bulk Update Items Service
 * Updates multiple items in an option group at once
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

/**
 * Input for bulk update operation
 */
export interface BulkUpdateItemInput {
  itemId: string;
  maxQuantity?: number;
  active?: boolean;
}

/**
 * Updates multiple items in an option group at once
 *
 * @param optionId - The custom optionId
 * @param updates - Array of update objects
 * @returns ApiResponse with the updated option group
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateItems('size-options', [
 *   { itemId: 'uuid-1', maxQuantity: 5 },
 *   { itemId: 'uuid-2', active: false },
 *   { itemId: 'uuid-3', maxQuantity: 3, active: true }
 * ]);
 * ```
 */
export async function bulkUpdateItems(
  optionId: string,
  updates: BulkUpdateItemInput[]
): Promise<ApiResponse<IOptionGroupDocument>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  if (!Array.isArray(updates) || updates.length === 0) {
    throw new ValidationError(
      'Invalid updates',
      'Updates array is required and must not be empty'
    );
  }

  // Validate each update
  for (const update of updates) {
    if (!update.itemId || typeof update.itemId !== 'string') {
      throw new ValidationError(
        'Invalid update',
        'Each update must have a valid itemId'
      );
    }
    if (
      update.maxQuantity !== undefined &&
      (typeof update.maxQuantity !== 'number' || update.maxQuantity < 0)
    ) {
      throw new ValidationError(
        'Invalid maxQuantity',
        `Invalid maxQuantity for item '${update.itemId}'`
      );
    }
    if (update.active !== undefined && typeof update.active !== 'boolean') {
      throw new ValidationError(
        'Invalid active',
        `Invalid active status for item '${update.itemId}'`
      );
    }
  }

  // Find the option group
  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(
      `Option group with optionId '${optionId}' not found`
    );
  }

  // Create a map of updates for quick lookup
  const updateMap = new Map<string, BulkUpdateItemInput>();
  for (const update of updates) {
    updateMap.set(update.itemId, update);
  }

  // Apply updates
  let updatedCount = 0;
  for (const item of optionGroup.items) {
    const update = updateMap.get(item.itemId);
    if (update) {
      if (update.maxQuantity !== undefined) {
        item.maxQuantity = update.maxQuantity;
      }
      if (update.active !== undefined) {
        item.active = update.active;
      }
      updatedCount++;
    }
  }

  await optionGroup.save();

  return {
    success: true,
    data: optionGroup,
    message: `Updated ${updatedCount} items in option group`,
  };
}
