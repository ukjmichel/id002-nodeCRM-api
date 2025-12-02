/**
 * Get the number of items in a menu
 */

import { MenuModel } from '../models/menu.model.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Get the number of items in a menu
 *
 * @param menuId - Menu identifier
 * @returns Count of items in the menu
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await getItemCount('lunch-menu-001');
 * console.log(`This menu has ${result.data} items`);
 * ```
 */
export const getItemCount = async (
  menuId: string
): Promise<ApiResponse<number>> => {
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

    const itemCount = menu.getItemCount();

    return {
      success: true,
      data: itemCount,
      count: itemCount,
      message: `Menu contains ${itemCount} item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error getting item count from menu',
      error.message || String(error)
    );
  }
};
