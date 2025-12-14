/**
 * Find By Item ID Service
 * Retrieves all option groups containing a specific item
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * Retrieves all option groups containing a specific item
 *
 * @param itemId - The item UUID
 * @returns ApiResponse with array of option groups
 * @throws {ValidationError} When itemId is invalid
 *
 * @example
 * ```typescript
 * const result = await findByItemId('550e8400-e29b-41d4-a716-446655440001');
 * ```
 */
export async function findByItemId(
  itemId: string
): Promise<ApiResponse<IOptionGroupDocument[]>> {
  if (!itemId || typeof itemId !== 'string') {
    throw new ValidationError(
      'Invalid itemId',
      'Item ID is required and must be a string'
    );
  }

  const optionGroups = await OptionGroupModel.find({
    'items.itemId': itemId,
  });

  return {
    success: true,
    data: optionGroups,
    count: optionGroups.length,
    message: `Found ${optionGroups.length} option groups containing item`,
  };
}
