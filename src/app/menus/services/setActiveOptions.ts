/**
 * Set all active options for an item in a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Set all active options for an item in a menu
 * Replaces all existing active options with the new array
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID
 * @param optionIds - Array of option IDs to set
 * @returns Updated menu
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await setActiveOptions(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   ['size-option', 'topping-option', 'sauce-option']
 * );
 * console.log(result.message); // "Active options set successfully"
 * ```
 */
export const setActiveOptions = async (
  menuId: string,
  itemId: string,
  optionIds: string[]
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

    if (!Array.isArray(optionIds)) {
      throw new ValidationError(
        'Invalid optionIds',
        'Option IDs must be an array'
      );
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

    // Set active options (remove duplicates)
    item.activeOptions = [...new Set(optionIds.map((id) => id.trim()))];
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Active options set successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error setting active options',
      error.message || String(error)
    );
  }
};
