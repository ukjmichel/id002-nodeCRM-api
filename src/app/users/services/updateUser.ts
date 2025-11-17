// src/app/users/services/updateUser.ts
/**
 * Update User Service
 * Updates a user record by ID
 * Note: verified status and password cannot be changed through this service
 */

import { UpdateOptions } from 'sequelize';
import { UserAttributes } from '../interfaces/user.interface.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';

/**
 * Update a user by ID
 * The verified and password fields are automatically excluded from updates
 * Use dedicated services to change these sensitive fields
 *
 * @param id - User ID
 * @param data - Data to update
 * @param options - Sequelize update options
 * @returns Updated user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * // Allowed updates:
 * const updatedUser = await updateUser('user-uuid-here', {
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   email: 'jane@example.com',
 *   username: 'janedoe'
 * });
 *
 * // These fields will be IGNORED:
 * await updateUser('user-uuid-here', {
 *   verified: true,  // verified field is ignored
 *   password: 'newPass123' // password field is ignored
 * });
 *
 * // Use dedicated services instead:
 * await verifyUser('user-uuid-here');           // To verify
 * await unverifyUser('user-uuid-here');         // To unverify
 * await updatePassword('user-uuid-here', 'newPass123'); // To change password
 * ```
 */
export const updateUser = async (
  id: number | string,
  data: Partial<UserAttributes>,
  options?: UpdateOptions
): Promise<ApiResponse<UserModel>> => {
  try {
    const record = await UserModel.findByPk(id);

    if (!record) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    // Remove protected fields from update data to prevent modification
    // Use dedicated services for these fields:
    // - verifyUser() / unverifyUser() for verified status
    // - updatePassword() for password changes
    const { verified, password, ...updateData } = data;

    await record.update(updateData as any, options);

    return {
      success: true,
      data: record,
      message: 'User updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for User', error.message);
    }
    throw new ValidationError(
      'Error updating User',
      error instanceof Error ? error.message : String(error)
    );
  }
};
