/**
 * Change Role Type Service
 * Changes a role's type (e.g., from customer to business)
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { RoleModel, RoleType } from '../models/role.model.js';
import { updateRole } from './updateRole.js';

/**
 * Change a role's type
 * Updates the roleType field to a new value
 *
 * @param roleId - Role's ID
 * @param newRoleType - New role type to assign
 * @returns Updated role record
 * @throws {NotFoundError} When role is not found
 * @throws {ValidationError} When update fails or invalid role type
 *
 * @example
 * ```typescript
 * const updatedRole = await changeRoleType(
 *   'role-uuid-here',
 *   RoleType.BUSINESS
 * );
 * console.log(updatedRole.data.roleType); // 'business'
 * ```
 */
export const changeRoleType = async (
  roleId: string,
  newRoleType: RoleType
): Promise<ApiResponse<RoleModel>> => {
  try {
    // Validate role type
    if (!Object.values(RoleType).includes(newRoleType)) {
      throw new ValidationError(
        'Invalid role type',
        `Role type must be one of: ${Object.values(RoleType).join(', ')}`
      );
    }

    const updatedRole = await updateRole(roleId, {
      roleType: newRoleType,
    });

    return {
      ...updatedRole,
      message: `Role type changed to ${newRoleType} successfully`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'Error changing role type',
      error instanceof Error ? error.message : String(error)
    );
  }
};
