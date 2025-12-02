/**
 * Remove a default item from an item in a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Remove a default item from an item in a menu
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID
 * @param defaultItemId - Default item ID to remove (must be valid UUID)
 * @returns Updated menu
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await removeDefaultItem(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '550e8400-e29b-41d4-a716-446655440099'
 * );
 * console.log(result.message); // "Default item removed successfully"
 * ```
 */
export const removeDefaultItem = async (
  menuId: string,
  itemId: string,
  defaultItemId: string
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

    if (!defaultItemId || defaultItemId.trim().length === 0) {
      throw new ValidationError(
        'Invalid defaultItemId',
        'Default item ID cannot be empty'
      );
    }

    if (!validateItemId(defaultItemId)) {
      throw new ValidationError(
        'Invalid default item ID format',
        'Default item ID must be a valid UUID'
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

    // Remove default item using instance method
    const removed = menu.removeDefaultItem(itemId, defaultItemId.trim());

    if (!removed) {
      return {
        success: true,
        data: menu,
        message: 'Default item does not exist for item',
      };
    }

    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Default item removed successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing default item',
      error.message || String(error)
    );
  }
};
