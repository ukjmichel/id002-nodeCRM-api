/**
 * Exists By Option ID Service
 * Checks if an option group exists by its optionId
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * Checks if an option group exists by its optionId
 *
 * @param optionId - The custom optionId
 * @returns ApiResponse with boolean indicating existence
 * @throws {ValidationError} When optionId is invalid
 *
 * @example
 * ```typescript
 * const result = await existsByOptionId('size-options');
 * if (result.data) {
 *   console.log('Option group exists');
 * }
 * ```
 */
export async function existsByOptionId(
  optionId: string
): Promise<ApiResponse<boolean>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  const exists = await OptionGroupModel.exists({ optionId });

  return {
    success: true,
    data: !!exists,
    message: exists
      ? `Option group '${optionId}' exists`
      : `Option group '${optionId}' does not exist`,
  };
}
