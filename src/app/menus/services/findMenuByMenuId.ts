/**
 * Find Menu By MenuId Service
 * Retrieves a single menu by its custom menuId field
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

/**
 * Get a single menu by menuId
 *
 * @param menuId - Menu's custom identifier
 * @returns Single menu record
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const menu = await findMenuByMenuId('lunch-menu-001');
 * console.log(menu.data.name);
 * ```
 */
export const findMenuByMenuId = async (
  menuId: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate menuId
    if (!menuId) {
      throw new ValidationError('Validation failed', 'Menu ID is required');
    }

    const record = await MenuModel.findByMenuId(menuId);

    if (!record) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    return {
      success: true,
      data: record,
      message: 'Menu retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
