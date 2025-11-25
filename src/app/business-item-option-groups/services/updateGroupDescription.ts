/**
 * Update the description of an option group
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { ApiResponse } from '../../../core/interfaces';
import { NotFoundError, ValidationError } from '../../../core/errors';

/**
 * Update the description of an option group
 *
 * @param optionId - Option group identifier
 * @param description - New description text
 * @returns Updated option group
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When validation fails or operation fails
 */
export const updateGroupDescription = async (
  optionId: string,
  description: string
): Promise<ApiResponse<IBusinessItemOptionGroupDocument>> => {
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

    // Find the option group
    const optionGroup = await BusinessItemOptionGroupModel.findByOptionId(
      optionId.trim()
    );

    if (!optionGroup) {
      throw new NotFoundError(
        `Option group with optionId '${optionId}' not found`
      );
    }

    // Update description and save
    optionGroup.description = description.trim();
    await optionGroup.save();

    return {
      success: true,
      data: optionGroup,
      message: 'Option group description updated successfully',
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
      throw new ValidationError('Validation failed for option group', messages);
    }

    throw new ValidationError(
      'Error updating option group description',
      error.message || String(error)
    );
  }
};
