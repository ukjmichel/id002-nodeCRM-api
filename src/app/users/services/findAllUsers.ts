/**
 * Find All Users Service
 * Retrieves all users with optional filters and pagination
 */

import { Transaction } from 'sequelize';
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
 * @param transaction - Optional transaction object
 * @returns Array of users with count
 * @throws {ValidationError} When query options are invalid
 *
 * @example
 * ```typescript
 * // Without transaction
 * const users = await findAllUsers({
 *   where: { verified: true },
 *   limit: 10,
 *   offset: 0,
 *   order: [['createdAt', 'DESC']]
 * });
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   const users = await findAllUsers({
 *     where: { verified: true },
 *     limit: 10
 *   }, t);
 *   // Other operations...
 * });
 * ```
 */
export const findAllUsers = async (
  options: FindOptions<Attributes<UserModel>> = {},
  transaction?: Transaction
): Promise<ApiResponse<UserModel[]>> => {
  try {
    const { where, limit, offset, order, include } = options;

    const queryOptions: FindOptions<Attributes<UserModel>> = {};
    if (where) queryOptions.where = where;
    if (limit) queryOptions.limit = limit;
    if (offset) queryOptions.offset = offset;
    if (order) queryOptions.order = order;
    if (include) queryOptions.include = include;
    if (transaction) queryOptions.transaction = transaction;

    const records = await UserModel.findAll(queryOptions);

    const countOptions: any = { where: where || {} };
    if (transaction) countOptions.transaction = transaction;
    const count = (await UserModel.count(countOptions)) as unknown as number;

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
