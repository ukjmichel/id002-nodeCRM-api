/**
 * Find Available Items Service
 * Retrieves all available business items
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { findAllBusinessItems } from './findAllBusinessItems.js';

/**
 * Find all available business items
 *
 * @param businessId - Optional business ID to filter by
 * @returns Array of available business items
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const availableItems = await findAvailableItems();
 * console.log(`Found ${availableItems.count} available items`);
 * ```
 */
export const findAvailableItems = async (
  businessId?: string
): Promise<ApiResponse<BusinessItemModel[]>> => {
  try {
    const where: any = { available: true };

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
      message: 'Available items retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching available items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
