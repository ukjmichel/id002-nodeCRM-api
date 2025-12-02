/**
 * Update menu name
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Update menu name
 *
 * @param menuId - Menu identifier
 * @param name - New name for the menu
 * @returns Updated menu
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When name is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await updateMenuName(
 *   'lunch-menu-001',
 *   'New Lunch Menu'
 * );
 * console.log(result.data.name); // "New Lunch Menu"
 * ```
 */
export const updateMenuName = async (
  menuId: string,
  name: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate inputs
    if (!menuId || menuId.trim().length === 0) {
      throw new ValidationError('Invalid menuId', 'Menu ID cannot be empty');
    }

    if (!name || name.trim().length === 0) {
      throw new ValidationError('Invalid name', 'Name cannot be empty');
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      throw new ValidationError(
        'Invalid name',
        'Name must be at least 2 characters long'
      );
    }

    if (trimmedName.length > 100) {
      throw new ValidationError(
        'Invalid name',
        'Name cannot exceed 100 characters'
      );
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    // Update name and save
    menu.name = trimmedName;
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Menu name updated successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating menu name',
      error.message || String(error)
    );
  }
};
