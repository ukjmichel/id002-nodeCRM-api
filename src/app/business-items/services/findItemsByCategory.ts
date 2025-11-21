/**
 * Find Items By Category Service
 * Finds all items with a specific category
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessItemModel, ItemCategory } from '../models/business-item.model.js';
import { findAllBusinessItems } from './findAllBusinessItems.js';
import { validateItemCategory } from '../utils/validation.js';

/**
 * Find all items with a specific category
 *
 * @param category - Item category (meat, poultry, seafood, etc.)
 * @param businessId - Optional business ID to filter by
 * @returns Array of business item records
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const seafoodItems = await findItemsByCategory('seafood');
 * console.log(`Found ${seafoodItems.count} seafood items`);
 * ```
 */
export const findItemsByCategory = async (
  category: ItemCategory,
  businessId?: string
): Promise<ApiResponse<BusinessItemModel[]>> => {
  try {
    // Validate category
    if (!category) {
      throw new ValidationError('Validation failed', 'Item category is required');
    }

    validateItemCategory(category);

    const where: any = { category };

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
      message: `Items of category '${category}' retrieved successfully`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      `Error fetching items of category ${category}`,
      error instanceof Error ? error.message : String(error)
    );
  }
};
