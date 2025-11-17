/**
 * Deactivate Role Service
 * Marks a role as inactive
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';
import { updateRole } from './updateRole.js';

/**
 * Mark a role as inactive
 * Sets the isActive flag to false
 *
 * @param roleId - Role's ID
 * @returns Updated role record
 * @throws {NotFoundError} When role is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const inactiveRole = await deactivateRole('role-uuid-here');
 * console.log(inactiveRole.data.isActive); // false
 * ```
 */
export const deactivateRole = async (
  roleId: string
): Promise<ApiResponse<RoleModel>> => {
  try {
    const updatedRole = await updateRole(roleId, {
      isActive: false,
    });

    return {
      ...updatedRole,
      message: 'Role deactivated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error deactivating role',
      error instanceof Error ? error.message : String(error)
    );
  }
};
