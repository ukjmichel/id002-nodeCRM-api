/**
 * Find One Menu Service
 * Finds a single menu by criteria
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { FilterQuery } from 'mongoose';

/**
 * Find one menu by criteria
 *
 * @param filter - Filter criteria
 * @returns Single menu record
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const menu = await findOneMenu({ name: 'Lunch Menu' });
 * ```
 */
export const findOneMenu = async (
  filter: FilterQuery<IMenuDocument>
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    const record = await MenuModel.findOne(filter);

    if (!record) {
      throw new NotFoundError('Menu not found');
    }

    return {
      success: true,
      data: record,
      message: 'Menu retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
