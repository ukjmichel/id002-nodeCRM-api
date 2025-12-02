/**
 * Check if a menu contains a specific item
 */

import { MenuModel } from '../models/menu.model.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Check if a menu contains a specific item
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID to check for
 * @returns Boolean indicating if the item is in the menu
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await hasItem(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.data); // true or false
 * ```
 */
export const hasItem = async (
  menuId: string,
  itemId: string
): Promise<ApiResponse<boolean>> => {
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

    const hasTheItem = menu.hasItem(itemId);

    return {
      success: true,
      data: hasTheItem,
      message: hasTheItem
        ? 'Item exists in menu'
        : 'Item does not exist in menu',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error checking if item exists in menu',
      error.message || String(error)
    );
  }
};
