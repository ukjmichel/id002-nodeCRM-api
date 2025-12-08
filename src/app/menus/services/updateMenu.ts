/**
 * Update Menu Service
 * Updates an existing menu record
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument, UpdateMenuInput } from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Update a menu by MongoDB _id
 *
 * @param id - Menu MongoDB _id
 * @param data - Data to update
 * @returns Updated menu record
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedMenu = await updateMenu('507f1f77bcf86cd799439011', {
 *   name: 'Updated Lunch Menu',
 *   description: 'New description'
 * });
 * ```
 */
export const updateMenu = async (
  id: string,
  data: UpdateMenuInput
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE ID
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
    // STEP 2: FIND EXISTING MENU
    // ========================================================================

    const menu = await MenuModel.findById(id);

    if (!menu) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: UPDATE FIELDS
    // ========================================================================

    if (data.name !== undefined) {
      menu.name = data.name;
    }

    if (data.description !== undefined) {
      menu.description = data.description;
    }

    if (data.items !== undefined) {
      menu.items = data.items;
    }

    // Pre-save hook will validate itemIds exist
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Menu updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      throw new ValidationError('Validation failed', error.message);
    }

    throw new ValidationError(
      'Error updating Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
