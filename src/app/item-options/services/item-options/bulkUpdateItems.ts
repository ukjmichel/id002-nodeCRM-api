/**
 * Bulk update items in an option
 */

import { ItemOptionsModel } from '../../models/item-option.model.js';
import { IItemOptionsDocument } from '../../interfaces/item-option.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
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
 * Bulk update items in an option
 * Updates multiple items' maxQuantity and/or active status at once
 *
 * @param optionId - Option identifier
 * @param updates - Array of item updates
 * @returns Updated option with count of updated items
 * @throws {NotFoundError} When option is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateItems('size-options-001', [
 *   { itemId: '550e8400-e29b-41d4-a716-446655440001', maxQuantity: 5 },
 *   { itemId: '550e8400-e29b-41d4-a716-446655440002', active: false },
 *   { itemId: '550e8400-e29b-41d4-a716-446655440003', maxQuantity: 10, active: true },
 * ]);
 * console.log(result.message); // "3 item(s) updated successfully"
 * ```
 */
export const bulkUpdateItems = async (
  optionId: string,
  updates: BulkUpdateItemInput[]
): Promise<ApiResponse<IItemOptionsDocument>> => {
  try {
    // Validate inputs
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    if (!Array.isArray(updates)) {
      throw new ValidationError('Invalid updates', 'Updates must be an array');
    }

    if (updates.length === 0) {
      throw new ValidationError(
        'Empty updates array',
        'At least one update must be provided'
      );
    }

    // Validate all updates
    const errors: string[] = [];
    updates.forEach((update, index) => {
      if (!update.itemId) {
        errors.push(`Update at index ${index}: itemId is required`);
        return;
      }

      if (!validateItemId(update.itemId)) {
        errors.push(`Update at index ${index}: Invalid item ID format`);
      }

      if (update.maxQuantity !== undefined) {
        if (
          typeof update.maxQuantity !== 'number' ||
          !Number.isInteger(update.maxQuantity)
        ) {
          errors.push(
            `Update at index ${index}: maxQuantity must be an integer`
          );
        } else if (update.maxQuantity < 1 || update.maxQuantity > 100) {
          errors.push(
            `Update at index ${index}: maxQuantity must be between 1 and 100`
          );
        }
      }

      if (update.active !== undefined && typeof update.active !== 'boolean') {
        errors.push(`Update at index ${index}: active must be a boolean`);
      }

      if (update.maxQuantity === undefined && update.active === undefined) {
        errors.push(
          `Update at index ${index}: At least maxQuantity or active must be provided`
        );
      }
    });

    if (errors.length > 0) {
      throw new ValidationError('Validation errors', errors.join('; '));
    }

    // Find the option
    const option = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!option) {
      throw new NotFoundError(`Option with optionId '${optionId}' not found`);
    }

    // Apply updates
    let updatedCount = 0;
    const notFoundItems: string[] = [];

    updates.forEach((update) => {
      if (!option.hasItem(update.itemId)) {
        notFoundItems.push(update.itemId);
        return;
      }

      let updated = false;

      if (update.maxQuantity !== undefined) {
        option.updateMaxQuantity(update.itemId, update.maxQuantity);
        updated = true;
      }

      if (update.active !== undefined) {
        option.setItemActive(update.itemId, update.active);
        updated = true;
      }

      if (updated) {
        updatedCount++;
      }
    });

    await option.save();

    let message = `${updatedCount} item(s) updated successfully`;
    if (notFoundItems.length > 0) {
      message += `. ${
        notFoundItems.length
      } item(s) not found: ${notFoundItems.join(', ')}`;
    }

    return {
      success: true,
      data: option,
      message,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error bulk updating items',
      error.message || String(error)
    );
  }
};
