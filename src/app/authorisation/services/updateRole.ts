/**
 * Update Role Service
 * Updates a role record by ID
 */

import { UpdateOptions } from 'sequelize';
import { RoleAttributes } from '../interfaces/role.interface.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Update a role by ID
 *
 * @param id - Role ID
 * @param data - Data to update
 * @param options - Sequelize update options
 * @returns Updated role record
 * @throws {NotFoundError} When role is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const updatedRole = await updateRole('role-uuid-here', {
 *   roleType: RoleType.BUSINESS,
 *   description: 'Upgraded to business account'
 * });
 * ```
 */
export const updateRole = async (
  id: number | string,
  data: Partial<RoleAttributes>,
  options?: UpdateOptions
): Promise<ApiResponse<RoleModel>> => {
  try {
    const record = await RoleModel.findByPk(id);

    if (!record) {
      throw new NotFoundError(`Role with ID ${id} not found`);
    }

    await record.update(data as any, options);

    return {
      success: true,
      data: record,
      message: 'Role updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for Role', error.message);
    }
    throw new ValidationError(
      'Error updating Role',
      error instanceof Error ? error.message : String(error)
    );
  }
};
