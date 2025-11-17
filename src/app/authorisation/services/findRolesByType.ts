/**
 * Find Roles By Type Service
 * Retrieves all roles of a specific type
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { RoleType } from '../models/role.model.js';
import { RoleModel } from '../models/role.model.js';
import { findAllRoles } from './findAllRoles.js';

/**
 * Find all roles of a specific type
 *
 * @param roleType - Type of role to filter by
 * @param includeInactive - Whether to include inactive roles (default: false)
 * @returns Array of roles
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const admins = await findRolesByType(RoleType.ADMINISTRATOR);
 * console.log(`Found ${admins.count} administrators`);
 * ```
 */
export const findRolesByType = async (
  roleType: RoleType,
  includeInactive: boolean = false
): Promise<ApiResponse<RoleModel[]>> => {
  try {
    const where: any = { roleType };

    if (!includeInactive) {
      where.isActive = true;
    }

    const result = await findAllRoles({ where });

    return {
      ...result,
      message: `Roles of type ${roleType} retrieved successfully`,
    };
  } catch (error) {
    throw new ValidationError(
      `Error fetching ${roleType} roles`,
      error instanceof Error ? error.message : String(error)
    );
  }
};
