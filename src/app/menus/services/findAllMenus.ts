/**
 * Find All Menus Service
 * Retrieves all menus with optional filters and pagination
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { FilterQuery, QueryOptions } from 'mongoose';

/**
 * Options for findAllMenus
 */
export interface FindAllMenusOptions {
  /** Filter criteria */
  filter?: FilterQuery<IMenuDocument>;
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
  /** Sort order */
  sort?: Record<string, 1 | -1>;
}

/**
 * Get all menus with optional filters and pagination
 *
 * @param options - Query options (filter, limit, skip, sort)
 * @returns Array of menus with count
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const menus = await findAllMenus({
 *   filter: { name: /lunch/i },
 *   limit: 10,
 *   skip: 0,
 *   sort: { name: 1 }
 * });
 * ```
 */
export const findAllMenus = async (
  options: FindAllMenusOptions = {}
): Promise<ApiResponse<IMenuDocument[]>> => {
  try {
    const { filter = {}, limit, skip, sort } = options;

    let query = MenuModel.find(filter);

    if (sort) {
      query = query.sort(sort);
    }

    if (skip !== undefined) {
      query = query.skip(skip);
    }

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const records = await query.exec();
    const count = await MenuModel.countDocuments(filter);

    return {
      success: true,
      data: records,
      count,
      message: 'Menus retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching Menus',
      error instanceof Error ? error.message : String(error)
    );
  }
};
