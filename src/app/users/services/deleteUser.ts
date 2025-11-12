/**
 * Delete User Service
 * Deletes a user record by ID
 */

import { UserModel } from '../models/user.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, DestroyOptions } from '../../../core/interfaces/index.js';

/**
 * Delete a user by ID
 *
 * @param id - User ID
 * @param options - Sequelize destroy options
 * @returns Deletion confirmation
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When deletion fails
 *
 * @example
 * ```typescript
 * await deleteUser('user-uuid-here');
 * ```
 */
export const deleteUser = async (
  id: number | string,
  options?: DestroyOptions
): Promise<ApiResponse<void>> => {
  try {
    const record = await UserModel.findByPk(id);

    if (!record) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    await record.destroy(options);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error deleting User',
      error instanceof Error ? error.message : String(error)
    );
  }
};
