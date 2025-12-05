/**
 * Find Options By Item ID Service
 * Retrieves all option groups associated with an item
 */

import { ItemOptionModel } from '../../models/item-option.model.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Find all option groups associated with an item
 *
 * @param itemId - Item UUID
 * @returns Array of item-option relationships
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await findOptionsByItemId(
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.data); // Array of ItemOptionModel
 * ```
 */
export const findOptionsByItemId = async (
  itemId: string
): Promise<ApiResponse<ItemOptionModel[]>> => {
  try {
    // Validate itemId (UUID)
    if (!itemId || !UUID_REGEX.test(itemId)) {
      throw new ValidationError(
        'Invalid itemId',
        'Item ID must be a valid UUID'
      );
    }

    const itemOptions = await ItemOptionModel.findAll({
      where: { itemId },
      order: [['sortOrder', 'ASC']],
    });

    return {
      success: true,
      data: itemOptions,
      count: itemOptions.length,
      message: `Found ${itemOptions.length} option(s) for item`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error finding options by item ID',
      error.message || String(error)
    );
  }
};
