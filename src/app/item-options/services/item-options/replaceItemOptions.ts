/**
 * Replace Item Options Service
 * Replaces all option groups for an item with a new set
 */


import { ReplaceItemOptionsInput } from '../../interfaces/item-option.interface.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';
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
 * Replace all option groups for an item with a new set
 *
 * @param input - Input containing itemId and new options array
 * @returns New item-option relationships
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await replaceItemOptions({
 *   itemId: '550e8400-e29b-41d4-a716-446655440001',
 *   options: [
 *     { optionId: '507f1f77bcf86cd799439011', sortOrder: 1, isRequired: true },
 *     { optionId: '507f1f77bcf86cd799439012', sortOrder: 2, isRequired: false }
 *   ]
 * });
 * ```
 */
export const replaceItemOptions = async (
  input: ReplaceItemOptionsInput
): Promise<ApiResponse<ItemOptionModel[]>> => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    const { itemId, options } = input;

    // Validate itemId (UUID)
    if (!itemId || !UUID_REGEX.test(itemId)) {
      throw new ValidationError(
        'Invalid itemId',
        'Item ID must be a valid UUID'
      );
    }

    // Validate options array
    if (!Array.isArray(options)) {
      throw new ValidationError(
        'Invalid options',
        'Options must be an array'
      );
    }

    // Validate each option
    const errors: string[] = [];
    options.forEach((option, index) => {
      if (!option.optionId || !OBJECT_ID_REGEX.test(option.optionId)) {
        errors.push(
          `Option at index ${index}: optionId must be a valid MongoDB ObjectId`
        );
      }
      if (option.sortOrder !== undefined && option.sortOrder < 0) {
        errors.push(
          `Option at index ${index}: sortOrder must be a non-negative integer`
        );
      }
    });

    if (errors.length > 0) {
      throw new ValidationError('Validation errors', errors.join('; '));
    }

    // Delete all existing relationships
    const deletedCount = await ItemOptionModel.destroy({
      where: { itemId },
      transaction,
    });

    // If no new options, commit and return
    if (options.length === 0) {
      await transaction.commit();
      return {
        success: true,
        data: [],
        message: `Cleared ${deletedCount} option(s) from item`,
      };
    }

    // Create new relationships
    const itemOptionsData = options.map((option, index) => ({
      itemId,
      optionId: option.optionId,
      sortOrder: option.sortOrder ?? index,
      isRequired: option.isRequired ?? false,
    }));

    const created = await ItemOptionModel.bulkCreate(itemOptionsData, {
      transaction,
    });

    await transaction.commit();

    return {
      success: true,
      data: created,
      message: `Replaced ${deletedCount} option(s) with ${created.length} new option(s)`,
    };
  } catch (error: any) {
    await transaction.rollback();

    if (error instanceof ValidationError) {
      throw error;
    }

    // Handle foreign key constraint error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new NotFoundError(`Item with ID '${input.itemId}' not found`);
    }

    throw new ValidationError(
      'Error replacing item options',
      error.message || String(error)
    );
  }
};
