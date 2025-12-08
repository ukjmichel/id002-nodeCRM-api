/**
 * Find Menus By Name Service
 * Finds menus by name (partial match, case-insensitive)
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

/**
 * Find menus by name (partial match)
 *
 * @param name - Name to search for (partial match, case-insensitive)
 * @returns Array of matching menus
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const menus = await findMenusByName('lunch');
 * console.log(`Found ${menus.count} menus matching 'lunch'`);
 * ```
 */
export const findMenusByName = async (
  name: string
): Promise<ApiResponse<IMenuDocument[]>> => {
  try {
    if (!name) {
      throw new ValidationError('Validation failed', 'Name is required');
    }

    const records = await MenuModel.findByName(name);
    const count = records.length;

    return {
      success: true,
      data: records,
      count,
      message:
        count === 0
          ? `No menus found matching '${name}'`
          : `Found ${count} menu(s) matching '${name}'`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Menus by name',
      error instanceof Error ? error.message : String(error)
    );
  }
};
