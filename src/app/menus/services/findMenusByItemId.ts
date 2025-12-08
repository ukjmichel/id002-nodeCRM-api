/**
 * Find Menus By Item ID Service
 * Finds all menus containing a specific item
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

/**
 * Find all menus containing a specific item
 *
 * @param itemId - Item UUID to search for
 * @returns Array of menus containing the item
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const menus = await findMenusByItemId('550e8400-e29b-41d4-a716-446655440000');
 * console.log(`Item is in ${menus.count} menus`);
 * ```
 */
export const findMenusByItemId = async (
  itemId: string
): Promise<ApiResponse<IMenuDocument[]>> => {
  try {
    if (!itemId) {
      throw new ValidationError('Validation failed', 'Item ID is required');
    }

    validateUuid(itemId, 'Item ID');

    const records = await MenuModel.findByItemId(itemId);
    const count = records.length;

    return {
      success: true,
      data: records,
      count,
      message:
        count === 0
          ? 'No menus found containing this item'
          : `Found ${count} menu(s) containing this item`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Menus by item ID',
      error instanceof Error ? error.message : String(error)
    );
  }
};
