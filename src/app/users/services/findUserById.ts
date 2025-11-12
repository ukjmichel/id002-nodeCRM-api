/**
 * Find User By ID Service
 * Retrieves a single user by their ID
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions } from '../../../core/interfaces/index.js';
import { UserModel } from "../models/user.model.js";






/**
 * Get a single user by ID
 *
 * @param id - User ID
 * @param options - Query options (include)
 * @returns Single user record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const user = await findUserById('user-uuid-here');
 * console.log(user.data.email);
 * ```
 */
export const findUserById = async (
  id: number | string,
  options: FindOneOptions = {}
): Promise<ApiResponse<UserModel>> => {
  try {
    const { include } = options;

    const record = await UserModel.findByPk(id, {
      ...(include && { include }),
    });

    if (!record) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return {
      success: true,
      data: record,
      message: 'User retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching User',
      error instanceof Error ? error.message : String(error)
    );
  }
};
