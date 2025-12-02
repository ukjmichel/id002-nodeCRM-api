/**
 * Find menu by menuId
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Find menu by menuId
 *
 * @param menuId - Menu identifier
 * @returns Menu document
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const result = await findByMenuId('lunch-menu-001');
 * console.log(result.data.name); // "Lunch Menu"
 * ```
 */
export const findByMenuId = async (
  menuId: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    if (!menuId || menuId.trim().length === 0) {
      throw new ValidationError('Invalid menuId', 'Menu ID cannot be empty');
    }

    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    return {
      success: true,
      data: menu,
      message: 'Menu retrieved successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching menu by menuId',
      error.message || String(error)
    );
  }
};
