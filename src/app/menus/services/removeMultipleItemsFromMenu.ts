/**
 * Remove multiple items from a menu at once
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Remove multiple items from a menu at once
 *
 * @param menuId - Menu identifier
 * @param itemIds - Array of business item IDs to remove (must be valid UUIDs)
 * @returns Updated menu with count of removed items
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await removeMultipleItemsFromMenu(
 *   'lunch-menu-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002'
 *   ]
 * );
 * console.log(result.message); // "2 item(s) removed from menu successfully"
 * ```
 */
export const removeMultipleItemsFromMenu = async (
  menuId: string,
  itemIds: string[]
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

    // Validate all item IDs
    const invalidIds = itemIds.filter((id) => !validateItemId(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(
        'Invalid item ID format',
        `The following item IDs are invalid: ${invalidIds.join(', ')}`
      );
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    // Remove all items using instance method
    let removedCount = 0;
    itemIds.forEach((itemId) => {
      if (menu.hasItem(itemId)) {
        menu.removeItem(itemId);
        removedCount++;
      }
    });

    await menu.save();

    return {
      success: true,
      data: menu,
      message: `${removedCount} item(s) removed from menu successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing multiple items from menu',
      error.message || String(error)
    );
  }
};
