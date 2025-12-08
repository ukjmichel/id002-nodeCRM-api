/**
 * Delete Menu Service
 * Deletes a menu record by ID
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Delete a menu by MongoDB _id
 *
 * @param id - Menu MongoDB _id
 * @returns Deletion confirmation
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When deletion fails
 *
 * @example
 * ```typescript
 * await deleteMenu('507f1f77bcf86cd799439011');
 * ```
 */
export const deleteMenu = async (id: string): Promise<ApiResponse<void>> => {
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
    // STEP 2: FIND AND DELETE MENU
    // ========================================================================

    const menu = await MenuModel.findByIdAndDelete(id);

    if (!menu) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Menu deleted successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error deleting Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
