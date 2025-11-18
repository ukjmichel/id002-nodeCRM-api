/**
 * Find User By ID Service
 * Retrieves a single user by their ID
 */

import { Transaction } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

/**
 * Get a single user by ID
 *
 * @param id - User ID
 * @param options - Query options (include)
 * @param transaction - Optional transaction object
 * @returns Single user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * // Without transaction
 * const user = await findUserById('user-uuid-here');
 * console.log(user.data.email);
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   const user = await findUserById('user-uuid-here', {}, t);
 *   // Other operations...
 * });
 * ```
 */
export const findUserById = async (
  id: number | string,
  options: FindOneOptions = {},
  transaction?: Transaction
): Promise<ApiResponse<UserModel>> => {
  try {
    const { include } = options;

    const findOptions: any = {};
    if (include) {
      findOptions.include = include;
    }
    if (transaction) {
      findOptions.transaction = transaction;
    }

    const record = await UserModel.findByPk(id, findOptions);

    if (!record) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return {
      success: true,
      data: record,
      message: 'User retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching User',
      error instanceof Error ? error.message : String(error)
    );
  }
};
