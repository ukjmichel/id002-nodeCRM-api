/**
 * Add a single item to a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Add a single item to a menu
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID to add (must be valid UUID)
 * @param quantity - Quantity for this item (default: 1)
 * @param activeOptions - Array of active option IDs (default: [])
 * @param defaultItems - Array of default item IDs (default: [])
 * @returns Updated menu
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * // Add item with defaults
 * const result = await addItemToMenu(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Add item with custom configuration
 * const result = await addItemToMenu(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   2,
 *   ['size-option', 'topping-option'],
 *   ['default-item-1', 'default-item-2']
 * );
 * ```
 */
export const addItemToMenu = async (
  menuId: string,
  itemId: string,
  quantity: number = 1,
  activeOptions: string[] = [],
  defaultItems: string[] = []
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

    // Validate quantity
    if (quantity < 1 || quantity > 1000) {
      throw new ValidationError(
        'Invalid quantity',
        'Quantity must be between 1 and 1000'
      );
    }

    // Validate defaultItems UUIDs
    if (defaultItems.length > 0) {
      const invalidDefaults = defaultItems.filter((id) => !validateItemId(id));
      if (invalidDefaults.length > 0) {
        throw new ValidationError(
          'Invalid default item ID format',
          `The following default item IDs are invalid: ${invalidDefaults.join(', ')}`
        );
      }
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    // Check if item already exists
    if (menu.hasItem(itemId)) {
      return {
        success: true,
        data: menu,
        message: 'Item already exists in menu',
      };
    }

    // Add item using instance method and save
    menu.addItem(itemId, quantity, activeOptions, defaultItems);
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Item added to menu successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error adding item to menu',
      error.message || String(error)
    );
  }
};
