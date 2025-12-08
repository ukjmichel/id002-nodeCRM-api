/**
 * Get Menu Item Service
 * Gets a specific item's configuration from a menu
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuItem } from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Get a specific item's configuration from a menu
 *
 * @param id - Menu MongoDB _id
 * @param itemId - Item UUID to get
 * @returns Item configuration
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const item = await getMenuItem(
 *   '507f1f77bcf86cd799439011',
 *   '550e8400-e29b-41d4-a716-446655440000'
 * );
 * console.log(item.data.quantity, item.data.allowOptions);
 * ```
 */
export const getMenuItem = async (
  id: string,
  itemId: string
): Promise<ApiResponse<IMenuItem>> => {
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
    // STEP 3: GET ITEM
    // ========================================================================

    const item = menu.getItem(itemId);

    if (!item) {
      throw new NotFoundError(`Item ${itemId} not found in this menu`);
    }

    return {
      success: true,
      data: item,
      message: 'Menu item retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error getting Menu item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
