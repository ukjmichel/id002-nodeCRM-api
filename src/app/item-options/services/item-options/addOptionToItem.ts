/**
 * Add Option To Item Service
 * Adds a single option group to an item
 */

import { AddOptionToItemInput } from '../../interfaces/item-option.interface.js';
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
 * Add a single option group to an item
 *
 * @param input - Input containing itemId, optionId, and optional settings
 * @returns Created item-option relationship
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const result = await addOptionToItem({
 *   itemId: '550e8400-e29b-41d4-a716-446655440001',
 *   optionId: '507f1f77bcf86cd799439011',
 *   sortOrder: 1,
 *   isRequired: true
 * });
 * ```
 */
export const addOptionToItem = async (
  input: AddOptionToItemInput
): Promise<ApiResponse<ItemOptionModel>> => {
  try {
    const { itemId, optionId, sortOrder = 0, isRequired = false } = input;

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
    if (sortOrder < 0) {
      throw new ValidationError(
        'Invalid sortOrder',
        'Sort order must be a non-negative integer'
      );
    }

    // Check if relationship already exists
    const existing = await ItemOptionModel.findOne({
      where: { itemId, optionId },
    });

    if (existing) {
      return {
        success: true,
        data: existing,
        message: 'Item-option relationship already exists',
      };
    }

    // Create new relationship
    const itemOption = await ItemOptionModel.create({
      itemId,
      optionId,
      sortOrder,
      isRequired,
    });

    return {
      success: true,
      data: itemOption,
      message: 'Option added to item successfully',
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }

    // Handle foreign key constraint error (item doesn't exist)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new NotFoundError(`Item with ID '${input.itemId}' not found`);
    }

    throw new ValidationError(
      'Error adding option to item',
      error.message || String(error)
    );
  }
};
