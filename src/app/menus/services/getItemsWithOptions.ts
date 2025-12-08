/**
 * Get Items With Options Service
 * Gets all items from a menu that allow options
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuItem } from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Get all items from a menu that allow options
 *
 * @param id - Menu MongoDB _id
 * @returns Array of items that allow options
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await getItemsWithOptions('507f1f77bcf86cd799439011');
 * console.log(`${result.count} items allow options`);
 * ```
 */
export const getItemsWithOptions = async (
  id: string
): Promise<ApiResponse<IMenuItem[]>> => {
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
    // STEP 3: GET ITEMS WITH OPTIONS
    // ========================================================================

    const items = menu.getItemsWithOptions();

    return {
      success: true,
      data: items,
      count: items.length,
      message: `Found ${items.length} item(s) that allow options`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error getting Menu items with options',
      error instanceof Error ? error.message : String(error)
    );
  }
};
