/**
 * Create Role Service
 * Creates a new role record
 */

import { ValidationError } from '../../../core/errors/index.js';
import { RoleAttributes } from '../interfaces/role.interface.js';
import { RoleModel } from '../models/role.model.js';
import { ApiResponse, CreateOptions } from '../../../core/interfaces/index.js';

/**
 * Create a new role
 *
 * @param data - Role data to create
 * @param options - Sequelize create options
 * @returns Created role record
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const newRole = await createRole({
 *   userId: 'user-uuid-here',
 *   roleType: RoleType.CUSTOMER,
 *   isActive: true,
 *   description: 'Regular customer account'
 * });
 * ```
 */
export const createRole = async (
  data: Partial<RoleAttributes>,
  options?: CreateOptions
): Promise<ApiResponse<RoleModel>> => {
  try {
    const record = await RoleModel.create(data as any, options);
    return {
      success: true,
      data: record,
      message: 'Role created successfully',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for Role', error.message);
    }
    throw new ValidationError(
      'Error creating Role',
      error instanceof Error ? error.message : String(error)
    );
  }
};
