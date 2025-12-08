/**
 * Get Menu Item Count Service
 * Gets the number of items in a menu
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Get the number of items in a menu
 *
 * @param id - Menu MongoDB _id
 * @returns Item count
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await getMenuItemCount('507f1f77bcf86cd799439011');
 * console.log(`Menu has ${result.data} items`);
 * ```
 */
export const getMenuItemCount = async (
  id: string
): Promise<ApiResponse<number>> => {
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
    // STEP 3: GET COUNT
    // ========================================================================

    const count = menu.getItemCount();

    return {
      success: true,
      data: count,
      count,
      message: `Menu has ${count} item(s)`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error getting Menu item count',
      error instanceof Error ? error.message : String(error)
    );
  }
};
