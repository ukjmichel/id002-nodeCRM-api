/**
 * Delete Role Service
 * Deletes a role record by ID
 */

import { RoleModel } from '../models/role.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, DestroyOptions } from '../../../core/interfaces/index.js';

/**
 * Delete a role by ID
 *
 * @param id - Role ID
 * @param options - Sequelize destroy options
 * @returns Deletion confirmation
 * @throws {NotFoundError} When role is not found
 * @throws {ValidationError} When deletion fails
 *
 * @example
 * ```typescript
 * await deleteRole('role-uuid-here');
 * ```
 */
export const deleteRole = async (
  id: number | string,
  options?: DestroyOptions
): Promise<ApiResponse<void>> => {
  try {
    const record = await RoleModel.findByPk(id);

    if (!record) {
      throw new NotFoundError(`Role with ID ${id} not found`);
    }

    await record.destroy(options);

    return {
      success: true,
      message: 'Role deleted successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error deleting Role',
      error instanceof Error ? error.message : String(error)
    );
  }
};
