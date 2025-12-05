/**
 * Find Item Option Service
 * Retrieves a specific item-option relationship
 */

import { ItemOptionModel } from '../../models/item-option.model.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';

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
 * Find a specific item-option relationship
 *
 * @param itemId - Item UUID
 * @param optionId - Option group MongoDB ObjectId
 * @returns Item-option relationship
 * @throws {ValidationError} When validation fails
 * @throws {NotFoundError} When relationship doesn't exist
 *
 * @example
 * ```typescript
 * const result = await findItemOption(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011'
 * );
 * console.log(result.data); // ItemOptionModel
 * ```
 */
export const findItemOption = async (
  itemId: string,
  optionId: string
): Promise<ApiResponse<ItemOptionModel>> => {
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

    const itemOption = await ItemOptionModel.findOne({
      where: { itemId, optionId },
    });

    if (!itemOption) {
      throw new NotFoundError(
        `Item-option relationship not found for item '${itemId}' and option '${optionId}'`
      );
    }

    return {
      success: true,
      data: itemOption,
      message: 'Item-option relationship found',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error finding item-option relationship',
      error.message || String(error)
    );
  }
};
