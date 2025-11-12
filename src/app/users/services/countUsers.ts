/**
 * Count Users Service
 * Counts users with optional filters
 */

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
 * @returns Count result
 * @throws {ValidationError} When count fails
 *
 * @example
 * ```typescript
 * const result = await countUsers({ verified: true });
 * console.log(`There are ${result.data} verified users`);
 * ```
 */
export const countUsers = async (
  where: WhereOptions<Attributes<UserModel>> = {},
  options?: CountOptions
): Promise<ApiResponse<number>> => {
  try {
    const count = await UserModel.count({
      where,
      ...options,
    });
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
