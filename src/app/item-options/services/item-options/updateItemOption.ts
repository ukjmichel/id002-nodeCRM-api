/**
 * Update Item Option Service
 * Updates an item-option relationship
 */


import { UpdateItemOptionInput } from '../../interfaces/item-option.interface.js';
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
 * Update an item-option relationship
 *
 * @param itemId - Item UUID
 * @param optionId - Option group MongoDB ObjectId
 * @param input - Update data (sortOrder, isRequired)
 * @returns Updated item-option relationship
 * @throws {ValidationError} When validation fails
 * @throws {NotFoundError} When relationship doesn't exist
 *
 * @example
 * ```typescript
 * const result = await updateItemOption(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011',
 *   { sortOrder: 5, isRequired: true }
 * );
 * ```
 */
export const updateItemOption = async (
  itemId: string,
  optionId: string,
  input: UpdateItemOptionInput
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

    // Validate input
    if (input.sortOrder !== undefined && input.sortOrder < 0) {
      throw new ValidationError(
        'Invalid sortOrder',
        'Sort order must be a non-negative integer'
      );
    }

    if (
      input.sortOrder === undefined &&
      input.isRequired === undefined
    ) {
      throw new ValidationError(
        'No update data provided',
        'At least sortOrder or isRequired must be provided'
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

    // Update fields
    if (input.sortOrder !== undefined) {
      itemOption.sortOrder = input.sortOrder;
    }
    if (input.isRequired !== undefined) {
      itemOption.isRequired = input.isRequired;
    }

    await itemOption.save();

    return {
      success: true,
      data: itemOption,
      message: 'Item-option relationship updated successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error updating item-option relationship',
      error.message || String(error)
    );
  }
};
