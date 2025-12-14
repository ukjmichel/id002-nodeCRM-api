/**
 * Create Option Group Service
 * Creates a new option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import {
  IOptionGroupDocument,
  CreateOptionGroupInput,
} from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * Creates a new option group
 *
 * @param data - The option group data
 * @returns ApiResponse with the created option group
 * @throws {ValidationError} When optionId already exists or validation fails
 *
 * @example
 * ```typescript
 * const result = await createOptionGroup({
 *   optionId: 'size-options',
 *   description: 'Size options for drinks',
 *   items: [
 *     { itemId: 'uuid-1', maxQuantity: 1, active: true }
 *   ]
 * });
 * ```
 */
export async function createOptionGroup(
  data: CreateOptionGroupInput
): Promise<ApiResponse<IOptionGroupDocument>> {
  // Check if optionId already exists
  const existing = await OptionGroupModel.findOne({ optionId: data.optionId });
  if (existing) {
    throw new ValidationError(
      'Duplicate optionId',
      `Option group with optionId '${data.optionId}' already exists`
    );
  }

  // Create the option group
  const optionGroup = await OptionGroupModel.create({
    optionId: data.optionId,
    description: data.description,
    items: data.items || [],
  });

  return {
    success: true,
    data: optionGroup,
    message: 'Option group created successfully',
  };
}
