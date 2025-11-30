/**
 * Find Items By Type Service
 * Finds all items with a specific type
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemModel, ItemType } from '../models/item.model.js';
import { findAllItems } from './findAllItems.js';
import { validateItemType } from '../utils/validation.js';

/**
 * Find all items with a specific type
 *
 * @param type - Item type (food, drink, dessert, etc.)
 * @param businessId - Optional business ID to filter by
 * @returns Array of business item records
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const foodItems = await findItemsByType('food');
 * console.log(`Found ${foodItems.count} food items`);
 * ```
 */
export const findItemsByType = async (
  type: ItemType,
  businessId?: string
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    // Validate type
    if (!type) {
      throw new ValidationError('Validation failed', 'Item type is required');
    }

    validateItemType(type);

    const where: any = { type };

    if (businessId) {
      where.businessId = businessId;
    }

    const result = await findAllItems({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return {
      ...result,
      message: `Items of type '${type}' retrieved successfully`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      `Error fetching items of type ${type}`,
      error instanceof Error ? error.message : String(error)
    );
  }
};
