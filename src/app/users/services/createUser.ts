// src/app/users/services/createUser.ts
/**
 * Create User Service
 * Creates a new user record
 * Users are created as unverified by default
 */

import { Transaction } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { UserAttributes } from '../interfaces/user.interface.js';
import { UserModel } from '../models/user.model.js';
import { ApiResponse, CreateOptions } from '../../../core/interfaces/index.js';
import { checkDuplicateFields } from '../utils/duplicateValidation.js';

/**
 * Create a new user
 * User will be created with verified: false regardless of input
 * Validates that username and email are unique before attempting creation
 *
 * @param data - User data to create
 * @param options - Sequelize create options
 * @param transaction - Optional transaction object
 * @returns Created user record
 * @throws {ValidationError} When validation fails or duplicate found
 *
 * @example
 * ```typescript
 * // Without transaction
 * const newUser = await createUser({
 *   username: 'johndoe',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   password: 'securePassword123'
 * });
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   const user = await createUser({
 *     username: 'johndoe',
 *     email: 'john@example.com',
 *     password: 'securePassword123'
 *   }, undefined, t);
 *   // Other operations...
 * });
 * ```
 */
export const createUser = async (
  data: Partial<UserAttributes>,
  options?: CreateOptions,
  transaction?: Transaction
): Promise<ApiResponse<UserModel>> => {
  try {
    // Check for duplicate email and username using utility function
    await checkDuplicateFields(
      {
        email: data.email,
        username: data.username,
      },
      undefined,
      transaction
    );

    // Ensure user is created as unverified
    const normalizedData = {
      ...data,
      verified: false,
    };

    const createOptions: CreateOptions = options || {};
    if (transaction) {
      createOptions.transaction = transaction;
    }

    const record = await UserModel.create(normalizedData as any, createOptions);

    return {
      success: true,
      data: record,
      message: 'User created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for User', error.message);
    }
    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      throw new ValidationError(
        'Validation failed for User',
        'Username or email already exists'
      );
    }
    throw new ValidationError(
      'Error creating User',
      error instanceof Error ? error.message : String(error)
    );
  }
};
