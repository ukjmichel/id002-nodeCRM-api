/**
 * Find Active Roles Service
 * Retrieves all active roles
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { RoleModel } from '../models/role.model.js';
import { findAllRoles } from './findAllRoles.js';

/**
 * Find all active roles
 *
 * @returns Array of active roles
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const activeRoles = await findActiveRoles();
 * console.log(`Found ${activeRoles.count} active roles`);
 * ```
 */
export const findActiveRoles = async (): Promise<ApiResponse<RoleModel[]>> => {
  try {
    const result = await findAllRoles({
      where: { isActive: true },
    });

    return {
      ...result,
      message: 'Active roles retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching active roles',
      error instanceof Error ? error.message : String(error)
    );
  }
};
