/**
 * Add multiple items to a menu at once
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Add multiple items to a menu at once
 *
 * @param menuId - Menu identifier
 * @param itemIds - Array of business item IDs to add (must be valid UUIDs)
 * @param defaultQuantity - Default quantity for new items (default: 1)
 * @param defaultActiveOptions - Default active options for new items (default: [])
 * @param defaultDefaultItems - Default default items for new items (default: [])
 * @returns Updated menu with count of added items
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * // Add items with defaults
 * const result = await addMultipleItemsToMenu(
 *   'lunch-menu-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002',
 *     '550e8400-e29b-41d4-a716-446655440003'
 *   ]
 * );
 *
 * // Add items with custom quantity
 * const result = await addMultipleItemsToMenu(
 *   'lunch-menu-001',
 *   ['550e8400-e29b-41d4-a716-446655440001'],
 *   3
 * );
 * ```
 */
export const addMultipleItemsToMenu = async (
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

    if (itemIds.length === 0) {
      throw new ValidationError(
        'Empty itemIds array',
        'At least one item ID must be provided'
      );
    }

    // Validate defaultQuantity
    if (defaultQuantity < 1 || defaultQuantity > 1000) {
      throw new ValidationError(
        'Invalid defaultQuantity',
        'Default quantity must be between 1 and 1000'
      );
    }

    // Validate all item IDs
    const invalidIds = itemIds.filter((id) => !validateItemId(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(
        'Invalid item ID format',
        `The following item IDs are invalid: ${invalidIds.join(', ')}`
      );
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

    // Add all items using instance method
    let addedCount = 0;
    itemIds.forEach((itemId) => {
      if (!menu.hasItem(itemId)) {
        menu.addItem(
          itemId,
          defaultQuantity,
          defaultActiveOptions,
          defaultDefaultItems
        );
        addedCount++;
      }
    });

    await menu.save();

    return {
      success: true,
      data: menu,
      message: `${addedCount} item(s) added to menu successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error adding multiple items to menu',
      error.message || String(error)
    );
  }
};
