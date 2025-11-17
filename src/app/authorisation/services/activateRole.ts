/**
 * Activate Role Service
 * Marks a role as active
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';
import { updateRole } from './updateRole.js';


/**
 * Mark a role as active
 * Sets the isActive flag to true
 *
 * @param roleId - Role's ID
 * @returns Updated role record
 * @throws {NotFoundError} When role is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const activeRole = await activateRole('role-uuid-here');
 * console.log(activeRole.data.isActive); // true
 * ```
 */
export const activateRole = async (
  roleId: string
): Promise<ApiResponse<RoleModel>> => {
  try {
    const updatedRole = await updateRole(roleId, {
      isActive: true,
    });

    return {
      ...updatedRole,
      message: 'Role activated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error activating role',
      error instanceof Error ? error.message : String(error)
    );
  }
};
