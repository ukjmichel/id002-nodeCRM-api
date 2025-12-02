/**
 * Bulk update items in a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Input for bulk update operation
 */
export interface BulkUpdateMenuItemInput {
  itemId: string;
  quantity?: number;
  activeOptions?: string[];
  defaultItems?: string[];
}

/**
 * Bulk update items in a menu
 * Updates multiple items' quantity, activeOptions, and/or defaultItems at once
 *
 * @param menuId - Menu identifier
 * @param updates - Array of item updates
 * @returns Updated menu with count of updated items
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateItems('lunch-menu-001', [
 *   { itemId: '550e8400-e29b-41d4-a716-446655440001', quantity: 5 },
 *   { itemId: '550e8400-e29b-41d4-a716-446655440002', activeOptions: ['size-option'] },
 *   { itemId: '550e8400-e29b-41d4-a716-446655440003', quantity: 10, defaultItems: ['default-1'] },
 * ]);
 * console.log(result.message); // "3 item(s) updated successfully"
 * ```
 */
export const bulkUpdateItems = async (
  menuId: string,
  updates: BulkUpdateMenuItemInput[]
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate inputs
    if (!menuId || menuId.trim().length === 0) {
      throw new ValidationError('Invalid menuId', 'Menu ID cannot be empty');
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

      if (update.quantity !== undefined) {
        if (
          typeof update.quantity !== 'number' ||
          !Number.isInteger(update.quantity)
        ) {
          errors.push(`Update at index ${index}: quantity must be an integer`);
        } else if (update.quantity < 1 || update.quantity > 1000) {
          errors.push(
            `Update at index ${index}: quantity must be between 1 and 1000`
          );
        }
      }

      if (update.activeOptions !== undefined) {
        if (!Array.isArray(update.activeOptions)) {
          errors.push(
            `Update at index ${index}: activeOptions must be an array`
          );
        }
      }

      if (update.defaultItems !== undefined) {
        if (!Array.isArray(update.defaultItems)) {
          errors.push(`Update at index ${index}: defaultItems must be an array`);
        } else {
          const invalidDefaults = update.defaultItems.filter(
            (id) => !validateItemId(id)
          );
          if (invalidDefaults.length > 0) {
            errors.push(
              `Update at index ${index}: Invalid default item IDs: ${invalidDefaults.join(', ')}`
            );
          }
        }
      }

      if (
        update.quantity === undefined &&
        update.activeOptions === undefined &&
        update.defaultItems === undefined
      ) {
        errors.push(
          `Update at index ${index}: At least quantity, activeOptions, or defaultItems must be provided`
        );
      }
    });

    if (errors.length > 0) {
      throw new ValidationError('Validation errors', errors.join('; '));
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    // Apply updates
    let updatedCount = 0;
    const notFoundItems: string[] = [];

    updates.forEach((update) => {
      const item = menu.getItem(update.itemId);
      if (!item) {
        notFoundItems.push(update.itemId);
        return;
      }

      let updated = false;

      if (update.quantity !== undefined) {
        menu.updateItemQuantity(update.itemId, update.quantity);
        updated = true;
      }

      if (update.activeOptions !== undefined) {
        item.activeOptions = [...new Set(update.activeOptions)];
        updated = true;
      }

      if (update.defaultItems !== undefined) {
        item.defaultItems = [...new Set(update.defaultItems)];
        updated = true;
      }

      if (updated) {
        updatedCount++;
      }
    });

    await menu.save();

    let message = `${updatedCount} item(s) updated successfully`;
    if (notFoundItems.length > 0) {
      message += `. ${notFoundItems.length} item(s) not found: ${notFoundItems.join(', ')}`;
    }

    return {
      success: true,
      data: menu,
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
