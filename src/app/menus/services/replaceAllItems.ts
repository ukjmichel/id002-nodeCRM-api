/**
 * Replace all items in a menu with new items
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Replace all items in a menu with new items
 *
 * @param menuId - Menu identifier
 * @param itemIds - Array of new item IDs (must be valid UUIDs)
 * @param defaultQuantity - Default quantity for new items (default: 1)
 * @param defaultActiveOptions - Default active options for new items (default: [])
 * @param defaultDefaultItems - Default default items for new items (default: [])
 * @returns Updated menu with new items
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await replaceAllItems(
 *   'lunch-menu-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002'
 *   ],
 *   2
 * );
 * console.log(result.message); // "Replaced 5 item(s) with 2 new item(s)"
 * ```
 */
export const replaceAllItems = async (
  menuId: string,
  itemIds: string[],
  defaultQuantity: number = 1,
  defaultActiveOptions: string[] = [],
  defaultDefaultItems: string[] = []
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate inputs
    if (!menuId || menuId.trim().length === 0) {
      throw new ValidationError('Invalid menuId', 'Menu ID cannot be empty');
    }

    if (!Array.isArray(itemIds)) {
      throw new ValidationError('Invalid itemIds', 'Item IDs must be an array');
    }

    // Validate defaultQuantity
    if (defaultQuantity < 1 || defaultQuantity > 1000) {
      throw new ValidationError(
        'Invalid defaultQuantity',
        'Default quantity must be between 1 and 1000'
      );
    }

    // Validate all item IDs (if any provided)
    if (itemIds.length > 0) {
      const invalidIds = itemIds.filter((id) => !validateItemId(id));
      if (invalidIds.length > 0) {
        throw new ValidationError(
          'Invalid item ID format',
          `The following item IDs are invalid: ${invalidIds.join(', ')}`
        );
      }
    }

    // Validate defaultDefaultItems UUIDs
    if (defaultDefaultItems.length > 0) {
      const invalidDefaults = defaultDefaultItems.filter(
        (id) => !validateItemId(id)
      );
      if (invalidDefaults.length > 0) {
        throw new ValidationError(
          'Invalid default item ID format',
          `The following default item IDs are invalid: ${invalidDefaults.join(', ')}`
        );
      }
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    const previousCount = menu.items.length;

    // Clear existing items
    menu.items = [];

    // Add new items
    itemIds.forEach((itemId) => {
      menu.addItem(
        itemId,
        defaultQuantity,
        defaultActiveOptions,
        defaultDefaultItems
      );
    });

    await menu.save();

    return {
      success: true,
      data: menu,
      message: `Replaced ${previousCount} item(s) with ${itemIds.length} new item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error replacing items in menu',
      error.message || String(error)
    );
  }
};
