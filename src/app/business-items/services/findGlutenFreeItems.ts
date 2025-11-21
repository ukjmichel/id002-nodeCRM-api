/**
 * Find Gluten-Free Items Service
 * Retrieves all gluten-free business items
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { findAllBusinessItems } from './findAllBusinessItems.js';

/**
 * Find all gluten-free business items
 *
 * @param businessId - Optional business ID to filter by
 * @returns Array of gluten-free business items
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const glutenFreeItems = await findGlutenFreeItems();
 * console.log(`Found ${glutenFreeItems.count} gluten-free items`);
 * ```
 */
export const findGlutenFreeItems = async (
  businessId?: string
): Promise<ApiResponse<BusinessItemModel[]>> => {
  try {
    const where: any = { isGlutenFree: true, available: true };

    if (businessId) {
      where.businessId = businessId;
    }

    const result = await findAllBusinessItems({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return {
      ...result,
      message: 'Gluten-free items retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching gluten-free items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
