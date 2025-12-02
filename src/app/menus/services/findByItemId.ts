/**
 * Find all menus that include a specific item
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ValidationError } from '../../../core/errors/index.js';

/**
 * Find all menus that include a specific item
 *
 * @param itemId - Business item ID (must be valid UUID)
 * @returns Array of menus containing the item
 * @throws {ValidationError} When itemId is invalid or query fails
 *
 * @example
 * ```typescript
 * const result = await findByItemId('550e8400-e29b-41d4-a716-446655440001');
 * console.log(result.data.length); // Number of menus containing this item
 * ```
 */
export const findByItemId = async (
  itemId: string
): Promise<ApiResponse<IMenuDocument[]>> => {
  try {
    // Validate item ID format
    if (!validateItemId(itemId)) {
      throw new ValidationError(
        'Invalid item ID format',
        'Item ID must be a valid UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)'
      );
    }

    const menus = await MenuModel.findByItemId(itemId);

    return {
      success: true,
      data: menus,
      count: menus.length,
      message: `Found ${menus.length} menu(s) containing item`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching menus by item ID',
      error.message || String(error)
    );
  }
};
