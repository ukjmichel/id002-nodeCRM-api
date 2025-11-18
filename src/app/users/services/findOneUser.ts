/**
 * Find One User Service
 * Finds a single user by criteria
 */

import { Transaction } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOneOptions,
  FindOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

/**
 * Find one user by criteria
 *
 * @param where - Where clause
 * @param options - Query options (include)
 * @param transaction - Optional transaction object
 * @returns Single user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * // Without transaction
 * const user = await findOneUser({ email: 'john@example.com' });
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   const user = await findOneUser({ email: 'john@example.com' }, {}, t);
 *   // Other operations...
 * });
 * ```
 */
export const findOneUser = async (
  where: WhereOptions<Attributes<UserModel>>,
  options: FindOneOptions = {},
  transaction?: Transaction
): Promise<ApiResponse<UserModel>> => {
  try {
    const { include } = options;

    const queryOptions: FindOptions<Attributes<UserModel>> = {
      where,
    };
    if (include) {
      queryOptions.include = include;
    }
    if (transaction) {
      queryOptions.transaction = transaction;
    }

    const record = await UserModel.findOne(queryOptions);

    if (!record) {
      throw new NotFoundError('User not found');
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
