/**
 * Find Inactive Roles Service
 * Retrieves all inactive roles
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';
import { findAllRoles } from './findAllRoles.js';

/**
 * Find all inactive roles
 *
 * @returns Array of inactive roles
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const inactiveRoles = await findInactiveRoles();
 * console.log(`Found ${inactiveRoles.count} inactive roles`);
 * ```
 */
export const findInactiveRoles = async (): Promise<
  ApiResponse<RoleModel[]>
> => {
  try {
    const result = await findAllRoles({
      where: { isActive: false },
    });

    return {
      ...result,
      message: 'Inactive roles retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching inactive roles',
      error instanceof Error ? error.message : String(error)
    );
  }
};
