/**
 * Update Sort Order Service
 * Updates the sort order of an option group for an item
 */


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
 * Update the sort order of an option group for an item
 *
 * @param itemId - Item UUID
 * @param optionId - Option group MongoDB ObjectId
 * @param sortOrder - New sort order
 * @returns Updated item-option relationship
 * @throws {ValidationError} When validation fails
 * @throws {NotFoundError} When relationship doesn't exist
 *
 * @example
 * ```typescript
 * const result = await updateSortOrder(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011',
 *   5
 * );
 * ```
 */
export const updateSortOrder = async (
  itemId: string,
  optionId: string,
  sortOrder: number
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

    // Validate sortOrder
    if (typeof sortOrder !== 'number' || !Number.isInteger(sortOrder)) {
      throw new ValidationError(
        'Invalid sortOrder',
        'Sort order must be an integer'
      );
    }

    if (sortOrder < 0) {
      throw new ValidationError(
        'Invalid sortOrder',
        'Sort order must be a non-negative integer'
      );
    }

    // Find the relationship
    const itemOption = await ItemOptionModel.findOne({
      where: { itemId, optionId },
    });

    if (!itemOption) {
      throw new NotFoundError(
        `Item-option relationship not found for item '${itemId}' and option '${optionId}'`
      );
    }

    // Update sort order
    itemOption.sortOrder = sortOrder;
    await itemOption.save();

    return {
      success: true,
      data: itemOption,
      message: `Sort order updated to ${sortOrder} successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating sort order',
      error.message || String(error)
    );
  }
};
