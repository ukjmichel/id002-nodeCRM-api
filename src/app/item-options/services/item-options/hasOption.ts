/**
 * Has Option Service
 * Checks if an item has a specific option group
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
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Check if an item has a specific option group
 *
 * @param itemId - Item UUID
 * @param optionId - Option group MongoDB ObjectId
 * @returns Boolean indicating if the relationship exists
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await hasOption(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011'
 * );
 * console.log(result.data); // true or false
 * ```
 */
export const hasOption = async (
  itemId: string,
  optionId: string
): Promise<ApiResponse<boolean>> => {
  try {
    // Validate itemId (UUID)
    if (!itemId || !UUID_REGEX.test(itemId)) {
      throw new ValidationError(
        'Invalid itemId',
        'Item ID must be a valid UUID'
      );
    }

    // Validate optionId (MongoDB ObjectId)
    if (!optionId || !OBJECT_ID_REGEX.test(optionId)) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID must be a valid MongoDB ObjectId (24 hex characters)'
      );
    }

    const count = await ItemOptionModel.count({
      where: { itemId, optionId },
    });

    const exists = count > 0;

    return {
      success: true,
      data: exists,
      message: exists
        ? 'Item has this option group'
        : 'Item does not have this option group',
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error checking item-option relationship',
      error.message || String(error)
    );
  }
};
