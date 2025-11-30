/**
 * Update the description of an Option
 */

import { ItemOptionsModel } from '../models/item-option.model.js';
import { IItemOptionsDocument } from '../interfaces/item-option.interface.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Update the description of an Option
 *
 * @param optionId - Option identifier
 * @param description - New description text
 * @returns Updated Option
 * @throws {NotFoundError} When Option is not found
 * @throws {ValidationError} When validation fails or operation fails
 */
export const updateOptionDescription = async (
  optionId: string,
  description: string
): Promise<ApiResponse<IItemOptionsDocument>> => {
  try {
    // Validate inputs
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    if (!description || description.trim().length === 0) {
      throw new ValidationError(
        'Invalid description',
        'Description cannot be empty'
      );
    }

    if (description.trim().length < 3) {
      throw new ValidationError(
        'Invalid description',
        'Description must be at least 3 characters long'
      );
    }

    if (description.trim().length > 500) {
      throw new ValidationError(
        'Invalid description',
        'Description cannot exceed 500 characters'
      );
    }

    // Find the Option
    const optionOption = await ItemOptionsModel.findByOptionId(
      optionId.trim()
    );

    if (!optionOption) {
      throw new NotFoundError(
        `Option with optionId '${optionId}' not found`
      );
    }

    // Update description and save
    optionOption.description = description.trim();
    await optionOption.save();

    return {
      success: true,
      data: optionOption,
      message: 'Option description updated successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', ');
      throw new ValidationError('Validation failed for Option', messages);
    }

    throw new ValidationError(
      'Error updating Option description',
      error.message || String(error)
    );
  }
};
