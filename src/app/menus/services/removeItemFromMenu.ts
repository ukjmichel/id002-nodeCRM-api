/**
 * Remove a single item from a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Remove a single item from a menu
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID to remove (must be valid UUID)
 * @returns Updated menu
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await removeItemFromMenu(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.message); // "Item removed from menu successfully"
 * ```
 */
export const removeItemFromMenu = async (
  menuId: string,
  itemId: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate inputs
    if (!menuId || menuId.trim().length === 0) {
      throw new ValidationError('Invalid menuId', 'Menu ID cannot be empty');
    }

    if (!itemId || itemId.trim().length === 0) {
      throw new ValidationError('Invalid itemId', 'Item ID cannot be empty');
    }

    if (!validateItemId(itemId)) {
      throw new ValidationError(
        'Invalid item ID format',
        'Item ID must be a valid UUID'
      );
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    // Check if item exists
    if (!menu.hasItem(itemId)) {
      return {
        success: true,
        data: menu,
        message: 'Item does not exist in menu',
      };
    }

    // Remove item using instance method and save
    menu.removeItem(itemId);
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Item removed from menu successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing item from menu',
      error.message || String(error)
    );
  }
};
