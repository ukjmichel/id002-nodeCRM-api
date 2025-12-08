/**
 * Has Menu Item Service
 * Checks if a menu contains a specific item
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { MenuModel } from '../models/menu.model.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Check if a menu contains a specific item
 *
 * @param id - Menu MongoDB _id
 * @param itemId - Item UUID to check
 * @returns Boolean indicating if item exists in menu
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await hasMenuItem(
 *   '507f1f77bcf86cd799439011',
 *   '550e8400-e29b-41d4-a716-446655440000'
 * );
 * console.log(result.data); // true or false
 * ```
 */
export const hasMenuItem = async (
  id: string,
  itemId: string
): Promise<ApiResponse<boolean>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE INPUTS
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

    if (!itemId) {
      throw new ValidationError('Validation failed', 'Item ID is required');
    }

    validateUuid(itemId, 'Item ID');

    // ========================================================================
    // STEP 2: FIND MENU
    // ========================================================================

    const menu = await MenuModel.findById(id);

    if (!menu) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: CHECK IF ITEM EXISTS
    // ========================================================================

    const hasItem = menu.hasItem(itemId);

    return {
      success: true,
      data: hasItem,
      message: hasItem
        ? 'Item exists in this menu'
        : 'Item does not exist in this menu',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error checking Menu item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
