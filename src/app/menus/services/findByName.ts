/**
 * Find menus by name (partial match)
 */

import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

import { ApiResponse } from '../../../core/interfaces/index.js';
import { ValidationError } from '../../../core/errors/index.js';

/**
 * Find menus by name (partial match, case-insensitive)
 *
 * @param name - Name or partial name to search for
 * @returns Array of menus matching the name
 * @throws {ValidationError} When name is invalid or query fails
 *
 * @example
 * ```typescript
 * const result = await findByName('lunch');
 * console.log(result.data); // All menus with "lunch" in their name
 * ```
 */
export const findByName = async (
  name: string
): Promise<ApiResponse<IMenuDocument[]>> => {
  try {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Invalid name', 'Name cannot be empty');
    }

    const menus = await MenuModel.findByName(name.trim());

    return {
      success: true,
      data: menus,
      count: menus.length,
      message: `Found ${menus.length} menu(s) matching name`,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching menus by name',
      error.message || String(error)
    );
  }
};
