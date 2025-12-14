/**
 * Find All Option Groups Service
 * Retrieves all option groups with optional filtering and pagination
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { FilterQuery } from 'mongoose';

/**
 * Options for finding all option groups
 */
export interface FindAllOptionGroupsOptions {
  filter?: FilterQuery<IOptionGroupDocument>;
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
  populate?: string | string[];
  select?: string;
}

/**
 * Retrieves all option groups with optional filtering and pagination
 *
 * @param options - Query options (filter, limit, skip, sort)
 * @returns ApiResponse with array of option groups
 *
 * @example
 * ```typescript
 * // Get all option groups
 * const result = await findAllOptionGroups();
 *
 * // With pagination
 * const result = await findAllOptionGroups({
 *   limit: 10,
 *   skip: 0,
 *   sort: { createdAt: -1 }
 * });
 * ```
 */
export async function findAllOptionGroups(
  options: FindAllOptionGroupsOptions = {}
): Promise<ApiResponse<IOptionGroupDocument[]>> {
  const {
    filter = {},
    limit = 100,
    skip = 0,
    sort = { createdAt: -1 },
    populate,
    select,
  } = options;

  let query = OptionGroupModel.find(filter).limit(limit).skip(skip).sort(sort);

  if (populate) query = query.populate(populate);
  if (select) query = query.select(select);

  const optionGroups = await query.exec();
  const count = await OptionGroupModel.countDocuments(filter);

  return {
    success: true,
    data: optionGroups,
    count,
    message: `Found ${optionGroups.length} option groups`,
  };
}
