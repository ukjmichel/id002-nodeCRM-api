/**
 * Find Featured Items Service
 * Retrieves all featured business items
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';
import { findAllItems } from './findAllItems.js';

/**
 * Find all featured business items
 *
 * @param businessId - Optional business ID to filter by
 * @returns Array of featured business items
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const featuredItems = await findFeaturedItems();
 * console.log(`Found ${featuredItems.count} featured items`);
 * ```
 */
export const findFeaturedItems = async (
  businessId?: string
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    const where: any = { featured: true, available: true };

    if (businessId) {
      where.businessId = businessId;
    }

    const result = await findAllItems({
      where,
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return {
      ...result,
      message: 'Featured items retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching featured items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
