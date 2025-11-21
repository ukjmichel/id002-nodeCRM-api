/**
 * Find Halal Items Service
 * Retrieves all halal business items
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { findAllBusinessItems } from './findAllBusinessItems.js';

/**
 * Find all halal business items
 *
 * @param businessId - Optional business ID to filter by
 * @returns Array of halal business items
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const halalItems = await findHalalItems();
 * console.log(`Found ${halalItems.count} halal items`);
 * ```
 */
export const findHalalItems = async (
  businessId?: string
): Promise<ApiResponse<BusinessItemModel[]>> => {
  try {
    const where: any = { isHalal: true, available: true };

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
      message: 'Halal items retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching halal items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
