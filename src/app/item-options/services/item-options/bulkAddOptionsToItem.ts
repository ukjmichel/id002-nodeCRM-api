/**
 * Bulk Add Options To Item Service
 * Adds multiple option groups to an item at once
 */

import { BulkAddOptionsToItemInput } from '../../interfaces/item-option.interface.js';
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
 * Add multiple option groups to an item at once
 *
 * @param input - Input containing itemId and array of options
 * @returns Created item-option relationships
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await bulkAddOptionsToItem({
 *   itemId: '550e8400-e29b-41d4-a716-446655440001',
 *   options: [
 *     { optionId: '507f1f77bcf86cd799439011', sortOrder: 1, isRequired: true },
 *     { optionId: '507f1f77bcf86cd799439012', sortOrder: 2, isRequired: false }
 *   ]
 * });
 * ```
 */
export const bulkAddOptionsToItem = async (
  input: BulkAddOptionsToItemInput
): Promise<ApiResponse<ItemOptionModel[]>> => {
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
    if (!Array.isArray(options) || options.length === 0) {
      throw new ValidationError(
        'Invalid options',
        'Options must be a non-empty array'
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

    // Get existing relationships to avoid duplicates
    const existingOptionIds = options.map((o) => o.optionId);
    const existing = await ItemOptionModel.findAll({
      where: {
        itemId,
        optionId: existingOptionIds,
      },
    });

    const existingSet = new Set(existing.map((e) => e.optionId));

    // Filter out already existing relationships
    const newOptions = options.filter((o) => !existingSet.has(o.optionId));

    if (newOptions.length === 0) {
      return {
        success: true,
        data: existing,
        message: 'All options already exist for this item',
      };
    }

    // Create new relationships
    const itemOptionsData = newOptions.map((option, index) => ({
      itemId,
      optionId: option.optionId,
      sortOrder: option.sortOrder ?? index,
      isRequired: option.isRequired ?? false,
    }));

    const created = await ItemOptionModel.bulkCreate(itemOptionsData);

    return {
      success: true,
      data: [...existing, ...created],
      message: `${created.length} option(s) added to item successfully. ${existing.length} already existed.`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }

    // Handle foreign key constraint error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new NotFoundError(`Item with ID '${input.itemId}' not found`);
    }

    throw new ValidationError(
      'Error bulk adding options to item',
      error.message || String(error)
    );
  }
};
