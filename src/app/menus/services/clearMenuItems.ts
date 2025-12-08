/**
 * Clear Menu Items Service
 * Removes all items from a menu
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Remove all items from a menu
 *
 * @param id - Menu MongoDB _id
 * @returns Updated menu record
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedMenu = await clearMenuItems('507f1f77bcf86cd799439011');
 * console.log(updatedMenu.data.items.length); // 0
 * ```
 */
export const clearMenuItems = async (
  id: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE INPUT
    // ========================================================================

    if (!id) {
      throw new ValidationError('Validation failed', 'Menu ID is required');
    }

    if (!OBJECT_ID_REGEX.test(id)) {
      throw new ValidationError(
        'Validation failed',
        'Menu ID must be a valid MongoDB ObjectId'
      );
    }

    // ========================================================================
    // STEP 2: FIND MENU
    // ========================================================================

    const menu = await MenuModel.findById(id);

    if (!menu) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: CLEAR ITEMS
    // ========================================================================

    const itemCount = menu.getItemCount();
    menu.items = [];
    await menu.save();

    return {
      success: true,
      data: menu,
      message: `${itemCount} item(s) removed from menu`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error clearing Menu items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
