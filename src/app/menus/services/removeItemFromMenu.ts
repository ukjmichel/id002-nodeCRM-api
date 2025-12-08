/**
 * Remove Item From Menu Service
 * Removes a single item from a menu
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Remove an item from a menu
 *
 * @param id - Menu MongoDB _id
 * @param itemId - Item UUID to remove
 * @returns Updated menu record
 * @throws {NotFoundError} When menu or item is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedMenu = await removeItemFromMenu(
 *   '507f1f77bcf86cd799439011',
 *   '550e8400-e29b-41d4-a716-446655440000'
 * );
 * ```
 */
export const removeItemFromMenu = async (
  id: string,
  itemId: string
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

    if (!menu.hasItem(itemId)) {
      throw new NotFoundError(`Item ${itemId} not found in this menu`);
    }

    // ========================================================================
    // STEP 4: REMOVE ITEM
    // ========================================================================

    menu.removeItem(itemId);
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Item removed from menu successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error removing item from Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
