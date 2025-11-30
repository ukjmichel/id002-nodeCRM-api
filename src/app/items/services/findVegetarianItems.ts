/**
 * Find Vegetarian Items Service
 * Retrieves all vegetarian business items
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';
import { findAllItems } from './findAllItems.js';

/**
 * Find all vegetarian business items
 *
 * @param businessId - Optional business ID to filter by
 * @returns Array of vegetarian business items
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const vegetarianItems = await findVegetarianItems();
 * console.log(`Found ${vegetarianItems.count} vegetarian items`);
 * ```
 */
export const findVegetarianItems = async (
  businessId?: string
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    const where: any = { isVegetarian: true, available: true };

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
      message: 'Vegetarian items retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching vegetarian items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
