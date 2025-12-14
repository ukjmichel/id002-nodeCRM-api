/**
 * Count Option Groups Service
 * Counts option groups with optional filtering
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { FilterQuery } from 'mongoose';

/**
 * Counts option groups with optional filtering
 *
 * @param filter - Optional filter query
 * @returns ApiResponse with the count
 *
 * @example
 * ```typescript
 * // Count all option groups
 * const result = await countOptionGroups();
 *
 * // Count with filter
 * const result = await countOptionGroups({ 'items.0': { $exists: true } });
 * ```
 */
export async function countOptionGroups(
  filter: FilterQuery<IOptionGroupDocument> = {}
): Promise<ApiResponse<number>> {
  const count = await OptionGroupModel.countDocuments(filter);

  return {
    success: true,
    data: count,
    count,
    message: `Found ${count} option groups`,
  };
}
