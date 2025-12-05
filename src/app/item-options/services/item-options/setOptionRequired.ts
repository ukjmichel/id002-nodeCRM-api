/**
 * Set Option Required Service
 * Sets the required status of an option group for an item
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
 * Set the required status of an option group for an item
 *
 * @param itemId - Item UUID
 * @param optionId - Option group MongoDB ObjectId
 * @param isRequired - New required status
 * @returns Updated item-option relationship
 * @throws {ValidationError} When validation fails
 * @throws {NotFoundError} When relationship doesn't exist
 *
 * @example
 * ```typescript
 * const result = await setOptionRequired(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011',
 *   true
 * );
 * ```
 */
export const setOptionRequired = async (
  itemId: string,
  optionId: string,
  isRequired: boolean
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

    // Validate isRequired
    if (typeof isRequired !== 'boolean') {
      throw new ValidationError(
        'Invalid isRequired',
        'isRequired must be a boolean'
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

    // Update required status
    itemOption.isRequired = isRequired;
    await itemOption.save();

    return {
      success: true,
      data: itemOption,
      message: `Option ${isRequired ? 'set as required' : 'set as optional'} successfully`,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error setting option required status',
      error.message || String(error)
    );
  }
};
