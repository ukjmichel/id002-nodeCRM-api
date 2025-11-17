/**
 * Find All Roles Service
 * Retrieves all roles with optional filters and pagination
 */

import { ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOptions,
} from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';

/**
 * Get all roles with optional filters and pagination
 *
 * @param options - Query options (where, limit, offset, order, include)
 * @returns Array of roles with count
 * @throws {ValidationError} When query options are invalid
 *
 * @example
 * ```typescript
 * const roles = await findAllRoles({
 *   where: { isActive: true },
 *   limit: 10,
 *   offset: 0,
 *   order: [['createdAt', 'DESC']],
 *   include: ['user']
 * });
 * ```
 */
export const findAllRoles = async (
  options: FindOptions<Attributes<RoleModel>> = {}
): Promise<ApiResponse<RoleModel[]>> => {
  try {
    const { where, limit, offset, order, include } = options;

    const queryOptions: FindOptions<Attributes<RoleModel>> = {
      ...(where && { where }),
      ...(limit && { limit }),
      ...(offset && { offset }),
      ...(order && { order }),
      ...(include && { include }),
    };

    const records = await RoleModel.findAll(queryOptions);
    const count = await RoleModel.count({ where: where || {} });

    return {
      success: true,
      data: records,
      count,
      message: 'Roles retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching Roles',
      error instanceof Error ? error.message : String(error)
    );
  }
};
