/**
 * Count Menus Service
 * Counts menus with optional filters
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { FilterQuery } from 'mongoose';

/**
 * Count menus with optional filters
 *
 * @param filter - Filter criteria
 * @returns Count result
 * @throws {ValidationError} When count fails
 *
 * @example
 * ```typescript
 * const result = await countMenus({ name: /lunch/i });
 * console.log(`There are ${result.data} lunch menus`);
 * ```
 */
export const countMenus = async (
  filter: FilterQuery<IMenuDocument> = {}
): Promise<ApiResponse<number>> => {
  try {
    const count = await MenuModel.countDocuments(filter);

    return {
      success: true,
      data: count,
      count,
      message: 'Menus counted successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error counting Menus',
      error instanceof Error ? error.message : String(error)
    );
  }
};
