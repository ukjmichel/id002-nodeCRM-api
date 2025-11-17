/**
 * Count Roles Service
 * Counts roles with optional filters
 */

import { RoleModel } from '../models/role.model.js';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import {
  Attributes,
  CountOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';

/**
 * Count roles with optional filters
 *
 * @param where - Where clause
 * @param options - Sequelize count options
 * @returns Count result
 * @throws {ValidationError} When count fails
 *
 * @example
 * ```typescript
 * const result = await countRoles({ roleType: RoleType.ADMINISTRATOR });
 * console.log(`There are ${result.data} administrators`);
 * ```
 */
export const countRoles = async (
  where: WhereOptions<Attributes<RoleModel>> = {},
  options?: CountOptions
): Promise<ApiResponse<number>> => {
  try {
    const count = await RoleModel.count({
      where,
      ...options,
    });
    return {
      success: true,
      data: count,
      count,
      message: 'Roles counted successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error counting Roles',
      error instanceof Error ? error.message : String(error)
    );
  }
};
