/**
 * Update item quantity in a menu
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Update item quantity in a menu
 *
 * @param menuId - Menu identifier
 * @param itemId - Business item ID to update
 * @param quantity - New quantity for the item
 * @returns Updated menu
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails or operation fails
 *
 * @example
 * ```typescript
 * const result = await updateItemQuantity(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   5
 * );
 * console.log(result.message); // "Item quantity updated successfully"
 * ```
 */
export const updateItemQuantity = async (
  menuId: string,
  itemId: string,
  quantity: number
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
    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
      throw new ValidationError(
        'Invalid quantity',
        'Quantity must be an integer'
      );
    }

    if (quantity < 1 || quantity > 1000) {
      throw new ValidationError(
        'Invalid quantity',
        'Quantity must be between 1 and 1000'
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

    // Update quantity using instance method and save
    menu.updateItemQuantity(itemId, quantity);
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Item quantity updated successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating item quantity',
      error.message || String(error)
    );
  }
};
