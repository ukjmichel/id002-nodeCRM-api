/**
 * Bulk Add Items To Menu Service
 * Adds multiple items to a menu at once
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { MenuModel } from '../models/menu.model.js';
import {
  IMenuDocument,
  AddMenuItemInput,
  BulkAddMenuItemsInput,
} from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Add multiple items to a menu at once
 *
 * @param id - Menu MongoDB _id
 * @param input - Items data to add
 * @returns Updated menu record
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedMenu = await bulkAddItemsToMenu('507f1f77bcf86cd799439011', {
 *   items: [
 *     { itemId: 'uuid-1', quantity: 1, allowOptions: true },
 *     { itemId: 'uuid-2', quantity: 2, allowOptions: false }
 *   ]
 * });
 * ```
 */
export const bulkAddItemsToMenu = async (
  id: string,
  input: BulkAddMenuItemsInput
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

    if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
      throw new ValidationError(
        'Validation failed',
        'Items array is required and must not be empty'
      );
    }

    // Validate each item
    for (const item of input.items) {
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
    // STEP 3: CHECK FOR DUPLICATES
    // ========================================================================

    const existingItemIds = new Set(menu.getItemIds());
    const newItemIds = input.items.map((item: AddMenuItemInput) => item.itemId);
    const duplicates = newItemIds.filter((itemId: string) => existingItemIds.has(itemId));

    if (duplicates.length > 0) {
      throw new ValidationError(
        'Duplicate items',
        `The following items already exist in this menu: ${duplicates.join(', ')}`
      );
    }

    // ========================================================================
    // STEP 4: ADD ITEMS
    // ========================================================================

    for (const item of input.items) {
      menu.addItem(
        item.itemId,
        item.quantity ?? 1,
        item.allowOptions ?? true
      );
    }

    // Pre-save hook will validate all itemIds exist
    await menu.save();

    return {
      success: true,
      data: menu,
      message: `${input.items.length} item(s) added to menu successfully`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      throw new ValidationError('Validation failed', error.message);
    }

    throw new ValidationError(
      'Error adding items to Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
