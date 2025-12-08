/**
 * Update Menu Item Service
 * Updates an item's configuration within a menu
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument, UpdateMenuItemInput } from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Update an item's configuration within a menu
 *
 * @param id - Menu MongoDB _id
 * @param itemId - Item UUID to update
 * @param input - Update data
 * @returns Updated menu record
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedMenu = await updateMenuItem(
 *   '507f1f77bcf86cd799439011',
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   { quantity: 5, allowOptions: false }
 * );
 * ```
 */
export const updateMenuItem = async (
  id: string,
  itemId: string,
  input: UpdateMenuItemInput
): Promise<ApiResponse<IMenuDocument>> => {
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

    // Validate at least one field is provided
    if (input.quantity === undefined && input.allowOptions === undefined) {
      throw new ValidationError(
        'Validation failed',
        'At least quantity or allowOptions must be provided'
      );
    }

    // Validate quantity if provided
    if (input.quantity !== undefined) {
      if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 1000) {
        throw new ValidationError(
          'Validation failed',
          'Quantity must be an integer between 1 and 1000'
        );
      }
    }

    // ========================================================================
    // STEP 2: FIND MENU
    // ========================================================================

    const menu = await MenuModel.findById(id);

    if (!menu) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: FIND ITEM
    // ========================================================================

    const item = menu.getItem(itemId);

    if (!item) {
      throw new NotFoundError(`Item ${itemId} not found in this menu`);
    }

    // ========================================================================
    // STEP 4: UPDATE ITEM
    // ========================================================================

    if (input.quantity !== undefined) {
      menu.updateItemQuantity(itemId, input.quantity);
    }

    if (input.allowOptions !== undefined) {
      menu.setItemAllowOptions(itemId, input.allowOptions);
    }

    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Menu item updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating Menu item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
