/**
 * Count Users Service
 * Counts users with optional filters
 */

import { Transaction } from 'sequelize';
import { UserModel } from '../models/user.model.js';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import {
  Attributes,
  CountOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';

/**
 * Count users with optional filters
 *
 * @param where - Where clause
 * @param options - Sequelize count options
 * @param transaction - Optional transaction object
 * @returns Count result
 * @throws {ValidationError} When count fails
 *
 * @example
 * ```typescript
 * // Without transaction
 * const result = await countUsers({ verified: true });
 * console.log(`There are ${result.data} verified users`);
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   const result = await countUsers({ verified: true }, undefined, t);
 *   console.log(`There are ${result.data} verified users`);
 * });
 * ```
 */
export const countUsers = async (
  where: WhereOptions<Attributes<UserModel>> = {},
  options?: CountOptions,
  transaction?: Transaction
): Promise<ApiResponse<number>> => {
  try {
    const countOptions: any = {
      where,
      ...(options || {}),
    };
    if (transaction) {
      countOptions.transaction = transaction;
    }

    const count = (await UserModel.count(countOptions)) as unknown as number;
    return {
      success: true,
      data: count,
      count,
      message: 'Users counted successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error counting Users',
      error instanceof Error ? error.message : String(error)
    );
  }
};
