/**
 * Find option by optionId
 */

import { ItemOptionsModel } from '../../models/item-option.model.js';
import { IItemOptionsDocument } from '../../interfaces/item-option.interface.js';

import { ApiResponse } from '../../../../core/interfaces/index.js';
import {
  NotFoundError,
  ValidationError,
} from '../../../../core/errors/index.js';
// import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Find option by optionId
 *
 * @param optionId - option identifier
 * @returns option document
 * @throws {NotFoundError} When option is not found
 * @throws {ValidationError} When query fails
 */
export const findByOptionId = async (
  optionId: string
): Promise<ApiResponse<IItemOptionsDocument>> => {
  try {
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    const optionOption = await ItemOptionsModel.findByOptionId(optionId.trim());

    if (!optionOption) {
      throw new NotFoundError(`option with optionId '${optionId}' not found`);
    }

    return {
      success: true,
      data: optionOption,
      message: 'option retrieved successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching option by optionId',
      error.message || String(error)
    );
  }
};
