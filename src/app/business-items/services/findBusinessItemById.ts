/**
 * Find Business Item By ID Service
 * Retrieves a single business item by their ID
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { validateUuid } from '../utils/validation.js';

/**
 * Get a single business item by ID
 *
 * @param id - Business item ID
 * @param options - Query options (include)
 * @returns Single business item record
 * @throws {NotFoundError} When business item is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const item = await findBusinessItemById('item-uuid-here');
 * console.log(item.data.name);
 * ```
 */
export const findBusinessItemById = async (
  id: string,
  options: FindOneOptions = {}
): Promise<ApiResponse<BusinessItemModel>> => {
  try {
    // Validate ID
    if (!id) {
      throw new ValidationError('Validation failed', 'Item ID is required');
    }

    validateUuid(id, 'Item ID');

    const { include } = options;

    const record = await BusinessItemModel.findByPk(id, {
      ...(include && { include }),
    });

    if (!record) {
      throw new NotFoundError(`Business item with ID ${id} not found`);
    }

    return {
      success: true,
      data: record,
      message: 'Business item retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching Business Item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
