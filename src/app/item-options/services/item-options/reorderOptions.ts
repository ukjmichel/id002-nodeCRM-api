/**
 * Reorder Options Service
 * Reorders all option groups for an item
 */


import { ApiResponse } from '../../../../core/interfaces/index.js';
import { ValidationError } from '../../../../core/errors/index.js';
import { Transaction } from 'sequelize';
import { ItemOptionModel } from '../../models/item-option.model.js';
import { sequelize } from '../../../../core/db/sequelize.js';


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
 * Reorder all option groups for an item
 *
 * @param itemId - Item UUID
 * @param optionIds - Array of option IDs in the desired order
 * @returns Updated item-option relationships
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await reorderOptions(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   [
 *     '507f1f77bcf86cd799439012', // Will be sortOrder 0
 *     '507f1f77bcf86cd799439011', // Will be sortOrder 1
 *     '507f1f77bcf86cd799439013'  // Will be sortOrder 2
 *   ]
 * );
 * ```
 */
export const reorderOptions = async (
  itemId: string,
  optionIds: string[]
): Promise<ApiResponse<ItemOptionModel[]>> => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    // Validate itemId (UUID)
    if (!itemId || !UUID_REGEX.test(itemId)) {
      throw new ValidationError(
        'Invalid itemId',
        'Item ID must be a valid UUID'
      );
    }

    // Validate optionIds array
    if (!Array.isArray(optionIds) || optionIds.length === 0) {
      throw new ValidationError(
        'Invalid optionIds',
        'Option IDs must be a non-empty array'
      );
    }

    // Validate each optionId
    const invalidIds = optionIds.filter((id) => !OBJECT_ID_REGEX.test(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(
        'Invalid optionId format',
        `The following option IDs are invalid: ${invalidIds.join(', ')}`
      );
    }

    // Update sort order for each option
    const updatePromises = optionIds.map((optionId, index) =>
      ItemOptionModel.update(
        { sortOrder: index },
        {
          where: { itemId, optionId },
          transaction,
        }
      )
    );

    await Promise.all(updatePromises);
    await transaction.commit();

    // Fetch updated relationships
    const updatedOptions = await ItemOptionModel.findAll({
      where: { itemId },
      order: [['sortOrder', 'ASC']],
    });

    return {
      success: true,
      data: updatedOptions,
      message: `Reordered ${optionIds.length} option(s) successfully`,
    };
  } catch (error: any) {
    await transaction.rollback();

    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error reordering options',
      error.message || String(error)
    );
  }
};
