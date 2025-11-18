/**
 * Delete User Service
 * Deletes a user record by ID
 */

import { Transaction } from 'sequelize';
import { UserModel } from '../models/user.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, DestroyOptions } from '../../../core/interfaces/index.js';

/**
 * Delete a user by ID
 *
 * @param id - User ID
 * @param options - Sequelize destroy options
 * @param transaction - Optional transaction object
 * @returns Deletion confirmation
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When deletion fails
 *
 * @example
 * ```typescript
 * // Without transaction
 * await deleteUser('user-uuid-here');
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   await deleteUser('user-uuid-here', undefined, t);
 *   // Other operations...
 * });
 * ```
 */
export const deleteUser = async (
  id: number | string,
  options?: DestroyOptions,
  transaction?: Transaction
): Promise<ApiResponse<void>> => {
  try {
    const record = await UserModel.findByPk(id, { transaction });

    if (!record) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    const destroyOptions: DestroyOptions = options || {};
    if (transaction) {
      destroyOptions.transaction = transaction;
    }

    await record.destroy(destroyOptions);

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
