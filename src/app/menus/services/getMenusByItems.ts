/**
 * Get all menus that contain any of the specified items
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { validateItemId } from './validateItemId.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ValidationError } from '../../../core/errors/index.js';

/**
 * Get all menus that contain any of the specified items
 *
 * @param itemIds - Array of business item IDs to search for
 * @returns Array of menus containing any of the items
 * @throws {ValidationError} When any item ID is invalid or operation fails
 *
 * @example
 * ```typescript
 * const result = await getMenusByItems([
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '550e8400-e29b-41d4-a716-446655440002'
 * ]);
 * console.log(result.data); // Array of menus containing these items
 * ```
 */
export const getMenusByItems = async (
  itemIds: string[]
): Promise<ApiResponse<IMenuDocument[]>> => {
  try {
    // Validate inputs
    if (!Array.isArray(itemIds)) {
      throw new ValidationError('Invalid itemIds', 'Item IDs must be an array');
    }

    if (itemIds.length === 0) {
      throw new ValidationError(
        'Empty itemIds array',
        'At least one item ID must be provided'
      );
    }

    // Validate all item IDs
    const invalidIds = itemIds.filter((id) => !validateItemId(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(
        'Invalid item ID format',
        `The following item IDs are invalid: ${invalidIds.join(', ')}`
      );
    }

    // Query menus - search in items.itemId field
    const menus = await MenuModel.find({
      'items.itemId': { $in: itemIds },
    });

    return {
      success: true,
      data: menus,
      count: menus.length,
      message: `Found ${menus.length} menu(s)`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching menus by items',
      error.message || String(error)
    );
  }
};
