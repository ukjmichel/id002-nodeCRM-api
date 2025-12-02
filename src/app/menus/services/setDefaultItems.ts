/**
 * Set all default items for an item in a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Set all default items for an item in a menu
 * Replaces all existing default items with the new array
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID
 * @param defaultItemIds - Array of default item IDs to set (must be valid UUIDs)
 * @returns Updated menu
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await setDefaultItems(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440098',
 *     '550e8400-e29b-41d4-a716-446655440099'
 *   ]
 * );
 * console.log(result.message); // "Default items set successfully"
 * ```
 */
export const setDefaultItems = async (
  menuId: string,
  itemId: string,
  defaultItemIds: string[]
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

    if (!Array.isArray(defaultItemIds)) {
      throw new ValidationError(
        'Invalid defaultItemIds',
        'Default item IDs must be an array'
      );
    }

    // Validate all default item IDs
    if (defaultItemIds.length > 0) {
      const invalidIds = defaultItemIds.filter((id) => !validateItemId(id));
      if (invalidIds.length > 0) {
        throw new ValidationError(
          'Invalid default item ID format',
          `The following default item IDs are invalid: ${invalidIds.join(', ')}`
        );
      }
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    // Check if item exists
    const item = menu.getItem(itemId);
    if (!item) {
      throw new NotFoundError(`Item with itemId '${itemId}' not found in menu`);
    }

    // Set default items (remove duplicates)
    item.defaultItems = [...new Set(defaultItemIds.map((id) => id.trim()))];
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Default items set successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error setting default items',
      error.message || String(error)
    );
  }
};
