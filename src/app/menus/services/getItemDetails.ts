/**
 * Get details of a specific item in a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuItem } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Get details of a specific item in a menu
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID to get details for
 * @returns Item configuration details
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When operation fails
 *
 * @example
 * ```typescript
 * const result = await getItemDetails(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.data);
 * // {
 * //   itemId: '550e8400-...',
 * //   quantity: 2,
 * //   activeOptions: ['size-option'],
 * //   defaultItems: ['default-item-1']
 * // }
 * ```
 */
export const getItemDetails = async (
  menuId: string,
  itemId: string
): Promise<ApiResponse<IMenuItem>> => {
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

    // Get item details using instance method
    const item = menu.getItem(itemId);

    if (!item) {
      throw new NotFoundError(`Item with itemId '${itemId}' not found in menu`);
    }

    return {
      success: true,
      data: item,
      message: 'Item details retrieved successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error getting item details',
      error.message || String(error)
    );
  }
};
