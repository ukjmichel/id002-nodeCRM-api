/**
 * Replace Menu Items Service
 * Replaces all items in a menu with a new set
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { MenuModel } from '../models/menu.model.js';
import {
  IMenuDocument,
  IMenuItem,
  AddMenuItemInput,
} from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Replace all items in a menu with a new set
 *
 * @param id - Menu MongoDB _id
 * @param items - New items array
 * @returns Updated menu record
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedMenu = await replaceMenuItems('507f1f77bcf86cd799439011', [
 *   { itemId: 'uuid-1', quantity: 1, allowOptions: true },
 *   { itemId: 'uuid-2', quantity: 2, allowOptions: false }
 * ]);
 * ```
 */
export const replaceMenuItems = async (
  id: string,
  items: AddMenuItemInput[]
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

    if (!Array.isArray(items)) {
      throw new ValidationError(
        'Validation failed',
        'Items must be an array'
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.itemId) {
        throw new ValidationError('Validation failed', 'Each item must have an itemId');
      }
      validateUuid(item.itemId, 'Item ID');
    }

    // ========================================================================
    // STEP 2: FIND MENU
    // ========================================================================

    const menu = await MenuModel.findById(id);

    if (!menu) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: REPLACE ITEMS
    // ========================================================================

    const newItems: IMenuItem[] = items.map((item: AddMenuItemInput) => ({
      itemId: item.itemId,
      quantity: item.quantity ?? 1,
      allowOptions: item.allowOptions ?? true,
    }));

    menu.items = newItems;

    // Pre-save hook will validate all itemIds exist and remove duplicates
    await menu.save();

    return {
      success: true,
      data: menu,
      message: `Menu items replaced successfully. ${menu.items.length} item(s) in menu.`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      throw new ValidationError('Validation failed', error.message);
    }

    throw new ValidationError(
      'Error replacing Menu items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
