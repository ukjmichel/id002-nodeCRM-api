/**
 * Remove All Options From Item Service
 * Removes all option groups from an item
 */


import { ItemOptionOperationResult } from '../../interfaces/item-option.interface.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ValidationError } from '../../../../core/errors/index.js';
import { ItemOptionModel } from '../../models/item-option.model.js';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Remove all option groups from an item
 *
 * @param itemId - Item UUID
 * @returns Operation result with count of removed options
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await removeAllOptionsFromItem(
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * console.log(result.data.affectedCount); // 5
 * ```
 */
export const removeAllOptionsFromItem = async (
  itemId: string
): Promise<ApiResponse<ItemOptionOperationResult>> => {
  try {
    // Validate itemId (UUID)
    if (!itemId || !UUID_REGEX.test(itemId)) {
      throw new ValidationError(
        'Invalid itemId',
        'Item ID must be a valid UUID'
      );
    }

    // Delete all relationships for this item
    const deletedCount = await ItemOptionModel.destroy({
      where: { itemId },
    });

    return {
      success: true,
      data: {
        success: true,
        message: `${deletedCount} option(s) removed from item`,
        affectedCount: deletedCount,
      },
      message: `${deletedCount} option(s) removed from item`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing all options from item',
      error.message || String(error)
    );
  }
};
