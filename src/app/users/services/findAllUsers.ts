/**
 * Find All Users Service
 * Retrieves all users with optional filters and pagination
 */

import { ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOptions,
} from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

/**
 * Get all users with optional filters and pagination
 *
 * @param options - Query options (where, limit, offset, order, include)
 * @returns Array of users with count
 * @throws {ValidationError} When query options are invalid
 *
 * @example
 * ```typescript
 * const users = await findAllUsers({
 *   where: { verified: true },
 *   limit: 10,
 *   offset: 0,
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export const findAllUsers = async (
  options: FindOptions<Attributes<UserModel>> = {}
): Promise<ApiResponse<UserModel[]>> => {
  try {
    const { where, limit, offset, order, include } = options;

    const queryOptions: FindOptions<Attributes<UserModel>> = {
      ...(where && { where }),
      ...(limit && { limit }),
      ...(offset && { offset }),
      ...(order && { order }),
      ...(include && { include }),
    };

    const records = await UserModel.findAll(queryOptions);
    const count = await UserModel.count({ where: where || {} });

    return {
      success: true,
      data: records,
      count,
      message: 'Users retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching Users',
      error instanceof Error ? error.message : String(error)
    );
  }
};
