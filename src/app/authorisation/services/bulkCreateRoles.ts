/**
 * Bulk Create Roles Service
 * Creates multiple role records at once
 */

import { ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  BulkCreateOptions,
} from '../../../core/interfaces/index.js';
import { RoleAttributes } from '../interfaces/role.interface.js';
import { RoleModel } from '../models/role.model.js';

/**
 * Bulk create roles
 *
 * @param dataArray - Array of role data to create
 * @param options - Sequelize bulk create options
 * @returns Created role records
 * @throws {ValidationError} When bulk creation fails
 *
 * @example
 * ```typescript
 * const roles = await bulkCreateRoles([
 *   { userId: 'user-1-uuid', roleType: RoleType.CUSTOMER },
 *   { userId: 'user-2-uuid', roleType: RoleType.STAFF }
 * ], { validate: true });
 * ```
 */
export const bulkCreateRoles = async (
  dataArray: Partial<RoleAttributes>[],
  options?: BulkCreateOptions
): Promise<ApiResponse<RoleModel[]>> => {
  try {
    const records = await RoleModel.bulkCreate(dataArray as any[], options);
    return {
      success: true,
      data: records,
      message: 'Roles created successfully',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for Roles', error.message);
    }
    throw new ValidationError(
      'Error bulk creating Roles',
      error instanceof Error ? error.message : String(error)
    );
  }
};
