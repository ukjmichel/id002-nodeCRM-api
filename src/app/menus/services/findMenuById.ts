/**
 * Find Menu By ID Service
 * Retrieves a single menu by its MongoDB _id
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Get a single menu by MongoDB _id
 *
 * @param id - Menu MongoDB _id
 * @returns Single menu record
 * @throws {NotFoundError} When menu is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const menu = await findMenuById('507f1f77bcf86cd799439011');
 * console.log(menu.data.name);
 * ```
 */
export const findMenuById = async (
  id: string
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // Validate ID
    if (!id) {
      throw new ValidationError('Validation failed', 'Menu ID is required');
    }

    if (!OBJECT_ID_REGEX.test(id)) {
      throw new ValidationError(
        'Validation failed',
        'Menu ID must be a valid MongoDB ObjectId'
      );
    }

    const record = await MenuModel.findById(id);

    if (!record) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    return {
      success: true,
      data: record,
      message: 'Menu retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
