/**
 * Find One Role Service
 * Finds a single role by criteria
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOneOptions,
  FindOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';

/**
 * Find one role by criteria
 *
 * @param where - Where clause
 * @param options - Query options (include)
 * @returns Single role record
 * @throws {NotFoundError} When role is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const role = await findOneRole({ userId: 'user-uuid-here' });
 * ```
 */
export const findOneRole = async (
  where: WhereOptions<Attributes<RoleModel>>,
  options: FindOneOptions = {}
): Promise<ApiResponse<RoleModel>> => {
  try {
    const { include } = options;

    const queryOptions: FindOptions<Attributes<RoleModel>> = {
      where,
      ...(include && { include }),
    };

    const record = await RoleModel.findOne(queryOptions);

    if (!record) {
      throw new NotFoundError('Role not found');
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
