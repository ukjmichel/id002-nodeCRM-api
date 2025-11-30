/**
 * Find Vegan Items Service
 * Retrieves all vegan business items
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';
import { findAllItems } from './findAllItems.js';

/**
 * Find all vegan business items
 *
 * @param businessId - Optional business ID to filter by
 * @returns Array of vegan business items
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const veganItems = await findVeganItems();
 * console.log(`Found ${veganItems.count} vegan items`);
 * ```
 */
export const findVeganItems = async (
  businessId?: string
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    const where: any = { isVegan: true, available: true };

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
      message: 'Vegan items retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching vegan items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
