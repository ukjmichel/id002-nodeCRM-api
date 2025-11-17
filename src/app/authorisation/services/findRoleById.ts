/**
 * Find Role By ID Service
 * Retrieves a single role by its ID
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';

/**
 * Get a single role by ID
 *
 * @param id - Role ID
 * @param options - Query options (include)
 * @returns Single role record
 * @throws {NotFoundError} When role is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const role = await findRoleById('role-uuid-here');
 * console.log(role.data.roleType);
 * ```
 */
export const findRoleById = async (
  userId: number | string,
  options: FindOneOptions = {}
): Promise<ApiResponse<RoleModel>> => {
  try {
    const { include } = options;

    const record = await RoleModel.findByPk(userId, {
      ...(include && { include }),
    });

    if (!record) {
      throw new NotFoundError(`Role for userID ${userId} not found`);
    }

    return {
      success: true,
      data: record,
      message: 'Role retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching Role',
      error instanceof Error ? error.message : String(error)
    );
  }
};
