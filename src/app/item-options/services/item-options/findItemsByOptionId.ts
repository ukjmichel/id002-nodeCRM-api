/**
 * Find Items By Option ID Service
 * Retrieves all items associated with an option group
 */

import { ItemOptionModel } from '../../models/item-option.model.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Find all items associated with an option group
 *
 * @param optionId - Option group MongoDB ObjectId
 * @returns Array of item-option relationships
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await findItemsByOptionId('507f1f77bcf86cd799439011');
 * console.log(result.data); // Array of ItemOptionModel
 * ```
 */
export const findItemsByOptionId = async (
  optionId: string
): Promise<ApiResponse<ItemOptionModel[]>> => {
  try {
    // Validate optionId (MongoDB ObjectId)
    if (!optionId || !OBJECT_ID_REGEX.test(optionId)) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID must be a valid MongoDB ObjectId (24 hex characters)'
      );
    }

    const itemOptions = await ItemOptionModel.findAll({
      where: { optionId },
      order: [['sortOrder', 'ASC']],
    });

    return {
      success: true,
      data: itemOptions,
      count: itemOptions.length,
      message: `Found ${itemOptions.length} item(s) for option group`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error finding items by option ID',
      error.message || String(error)
    );
  }
};
