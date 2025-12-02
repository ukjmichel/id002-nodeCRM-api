/**
 * Update menu description
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Update menu description
 *
 * @param menuId - Menu identifier
 * @param description - New description for the menu
 * @returns Updated menu
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When description is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await updateMenuDescription(
 *   'lunch-menu-001',
 *   'Updated lunch menu with new seasonal items'
 * );
 * console.log(result.data.description);
 * ```
 */
export const updateMenuDescription = async (
  menuId: string,
  description: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate inputs
    if (!menuId || menuId.trim().length === 0) {
      throw new ValidationError('Invalid menuId', 'Menu ID cannot be empty');
    }

    if (!description || description.trim().length === 0) {
      throw new ValidationError(
        'Invalid description',
        'Description cannot be empty'
      );
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 3) {
      throw new ValidationError(
        'Invalid description',
        'Description must be at least 3 characters long'
      );
    }

    if (trimmedDescription.length > 1000) {
      throw new ValidationError(
        'Invalid description',
        'Description cannot exceed 1000 characters'
      );
    }

    // Find the menu
    const menu = await MenuModel.findByMenuId(menuId.trim());

    if (!menu) {
      throw new NotFoundError(`Menu with menuId '${menuId}' not found`);
    }

    // Update description and save
    menu.description = trimmedDescription;
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Menu description updated successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating menu description',
      error.message || String(error)
    );
  }
};
