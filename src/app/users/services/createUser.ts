// src/app/users/services/createUser.ts
/**
 * Create User Service
 * Creates a new user record
 * Users are created as unverified by default
 */

import { ValidationError } from '../../../core/errors/index.js';
import { UserAttributes } from '../interfaces/user.interface.js';
import { UserModel } from '../models/user.model.js';
import { ApiResponse, CreateOptions } from '../../../core/interfaces/index.js';

/**
 * Create a new user
 * User will be created with verified: false regardless of input
 *
 * @param data - User data to create
 * @param options - Sequelize create options
 * @returns Created user record
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const newUser = await createUser({
 *   username: 'johndoe',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   password: 'securePassword123'
 * });
 * // newUser.data.verified will always be false
 * ```
 */
export const createUser = async (
  data: Partial<UserAttributes>,
  options?: CreateOptions
): Promise<ApiResponse<UserModel>> => {
  try {
    // Ensure user is created as unverified
    const normalizedData = {
      ...data,
      verified: false,
    };

    const record = await UserModel.create(normalizedData as any, options);

    return {
      success: true,
      data: record,
      message: 'User created successfully',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for User', error.message);
    }
    throw new ValidationError(
      'Error creating User',
      error instanceof Error ? error.message : String(error)
    );
  }
};
