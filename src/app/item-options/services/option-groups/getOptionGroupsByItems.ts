/**
 * Get Option Groups By Items Service
 * Retrieves all option groups containing any of the specified items
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * Retrieves all option groups containing any of the specified items
 *
 * @param itemIds - Array of item UUIDs
 * @returns ApiResponse with array of option groups
 * @throws {ValidationError} When itemIds is invalid
 *
 * @example
 * ```typescript
 * const result = await getOptionGroupsByItems([
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '550e8400-e29b-41d4-a716-446655440002'
 * ]);
 * ```
 */
export async function getOptionGroupsByItems(
  itemIds: string[]
): Promise<ApiResponse<IOptionGroupDocument[]>> {
  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    throw new ValidationError(
      'Invalid itemIds',
      'Item IDs array is required and must not be empty'
    );
  }

  const optionGroups = await OptionGroupModel.find({
    'items.itemId': { $in: itemIds },
  });

  return {
    success: true,
    data: optionGroups,
    count: optionGroups.length,
    message: `Found ${optionGroups.length} option groups containing specified items`,
  };
}
