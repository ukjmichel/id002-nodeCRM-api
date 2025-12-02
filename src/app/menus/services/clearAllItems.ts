/**
 * Remove all items from a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Remove all items from a menu
 *
 * @param menuId - Menu identifier
 * @returns Updated menu with empty items array
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await clearAllItems('lunch-menu-001');
 * console.log(result.message); // "Cleared 5 item(s) from menu"
 * ```
 */
export const clearAllItems = async (
  menuId: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate input
    if (!menuId || menuId.trim().length === 0) {
      throw new ValidationError('Invalid menuId', 'Menu ID cannot be empty');
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    const previousCount = menu.items.length;

    // Clear all items and save
    menu.items = [];
    await menu.save();

    return {
      success: true,
      data: menu,
      message: `Cleared ${previousCount} item(s) from menu`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error clearing items from menu',
      error.message || String(error)
    );
  }
};
