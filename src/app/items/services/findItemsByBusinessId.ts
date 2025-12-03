/**
 * Find Items By Business ID Service
 * Finds all items belonging to a specific business
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';
import { findAllItems } from './findAllItems.js';
import { validateUuid } from '../utils/validation.js';

/**
 * Find all items for a specific business
 *
 * @param businessId - Business ID
 * @returns Array of business item records
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const items = await findItemsByBusinessId('business-uuid-here');
 * console.log(`Business has ${items.count} items`);
 * ```
 */
export const findItemsByBusinessId = async (
  businessId: string
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    // Validate business ID
    if (!businessId) {
      throw new ValidationError('Validation failed', 'Business ID is required');
    }

    validateUuid(businessId, 'Business ID');

    const result = await findAllItems({
      where: { businessId },
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return {
      ...result,
      message:
        result.count === 0
          ? 'No items found for this business'
          : `Found ${result.count} item(s) for this business`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching business items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
