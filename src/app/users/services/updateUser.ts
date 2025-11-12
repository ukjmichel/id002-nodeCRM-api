/**
 * Update User Service
 * Updates a user record by ID
 */

import { UpdateOptions } from 'sequelize';
import { UserAttributes } from '../interfaces/user.interface.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { UserModel } from '../models/user.model.js';

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';


/**
 * Update a user by ID
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
 * const updatedUser = await updateUser('user-uuid-here', {
 *   firstName: 'Jane',
 *   verified: true
 * });
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

    await record.update(data as any, options);

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
