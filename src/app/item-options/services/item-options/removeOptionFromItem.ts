/**
 * Remove Option From Item Service
 * Removes a single option group from an item
 */


import { ItemOptionOperationResult } from '../../interfaces/item-option.interface.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';
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
 * Remove a single option group from an item
 *
 * @param itemId - Item UUID
 * @param optionId - Option group MongoDB ObjectId
 * @returns Operation result
 * @throws {ValidationError} When validation fails
 * @throws {NotFoundError} When relationship doesn't exist
 *
 * @example
 * ```typescript
 * const result = await removeOptionFromItem(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011'
 * );
 * ```
 */
export const removeOptionFromItem = async (
  itemId: string,
  optionId: string
): Promise<ApiResponse<ItemOptionOperationResult>> => {
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

    // Delete the relationship
    const deletedCount = await ItemOptionModel.destroy({
      where: { itemId, optionId },
    });

    if (deletedCount === 0) {
      throw new NotFoundError(
        `Option '${optionId}' is not associated with item '${itemId}'`
      );
    }

    return {
      success: true,
      data: {
        success: true,
        message: 'Option removed from item successfully',
        affectedCount: deletedCount,
      },
      message: 'Option removed from item successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error removing option from item',
      error.message || String(error)
    );
  }
};
