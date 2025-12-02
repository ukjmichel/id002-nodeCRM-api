/**
 * Get all default items for an item in a menu
 */

import { MenuModel } from '../models/menu.model.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Get all default items for an item in a menu
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID
 * @returns Array of default item IDs
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await getDefaultItems(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.data); // ['550e8400-...', '550e8400-...']
 * ```
 */
export const getDefaultItems = async (
  menuId: string,
  itemId: string
): Promise<ApiResponse<string[]>> => {
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
      throw new NotFoundError(`Item with itemId '${itemId}' not found in menu`);
    }

    // Get default items using instance method
    const defaultItems = menu.getDefaultItems(itemId);

    return {
      success: true,
      data: defaultItems,
      count: defaultItems.length,
      message: `Found ${defaultItems.length} default item(s)`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error getting default items',
      error.message || String(error)
    );
  }
};
