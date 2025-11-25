/**
 * Find option group by optionId
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import { IBusinessItemOptionGroupDocument } from '../interfaces/business-item-option-group.interface';

import { ApiResponse } from '../../../core/interfaces';
import { NotFoundError, ValidationError } from '../../../core/errors';

/**
 * Find option group by optionId
 *
 * @param optionId - Option group identifier
 * @returns Option group document
 * @throws {NotFoundError} When option group is not found
 * @throws {ValidationError} When query fails
 */
export const findByOptionId = async (
  optionId: string
): Promise<ApiResponse<IBusinessItemOptionGroupDocument>> => {
  try {
    if (!optionId || optionId.trim().length === 0) {
      throw new ValidationError(
        'Invalid optionId',
        'Option ID cannot be empty'
      );
    }

    const optionGroup = await BusinessItemOptionGroupModel.findByOptionId(
      optionId.trim()
    );

    if (!optionGroup) {
      throw new NotFoundError(
        `Option group with optionId '${optionId}' not found`
      );
    }

    return {
      success: true,
      data: optionGroup,
      message: 'Option group retrieved successfully',
    };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching option group by optionId',
      error.message || String(error)
    );
  }
};
