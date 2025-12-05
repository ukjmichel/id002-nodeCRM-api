/**
 * Get Option Count Service
 * Gets the count of option groups for an item
 */


import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ValidationError } from '../../../../core/errors/index.js';
import { ItemOptionModel } from '../../models/item-option.model.js';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Get the count of option groups for an item
 *
 * @param itemId - Item UUID
 * @returns Count of option groups
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await getOptionCount('550e8400-e29b-41d4-a716-446655440001');
 * console.log(result.data); // 5
 * ```
 */
export const getOptionCount = async (
  itemId: string
): Promise<ApiResponse<number>> => {
  try {
    // Validate itemId (UUID)
    if (!itemId || !UUID_REGEX.test(itemId)) {
      throw new ValidationError(
        'Invalid itemId',
        'Item ID must be a valid UUID'
      );
    }

    const count = await ItemOptionModel.count({
      where: { itemId },
    });

    return {
      success: true,
      data: count,
      count,
      message: `Item has ${count} option group(s)`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error counting item options',
      error.message || String(error)
    );
  }
};
