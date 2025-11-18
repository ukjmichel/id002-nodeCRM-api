// src/app/users/services/bulkCreateUsers.ts
/**
 * Bulk Create Users Service
 * Creates multiple user records at once
 * All users are created as unverified by default
 */

import { Transaction } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  BulkCreateOptions,
} from '../../../core/interfaces/index.js';
import { UserAttributes } from '../interfaces/user.interface.js';
import { UserModel } from '../models/user.model.js';
import { validateBulkUserData } from '../utils/duplicateValidation.js';

/**
 * Bulk create users
 * All users will be created with verified: false regardless of input
 * Validates that usernames and emails are unique before attempting creation
 *
 * @param dataArray - Array of user data to create
 * @param options - Sequelize bulk create options
 * @param transaction - Optional transaction object
 * @returns Created user records
 * @throws {ValidationError} When bulk creation fails or duplicates found
 *
 * @example
 * ```typescript
 * // Without transaction
 * const users = await bulkCreateUsers([
 *   { username: 'user1', email: 'user1@example.com', password: 'pass123', ... },
 *   { username: 'user2', email: 'user2@example.com', password: 'pass456', ... }
 * ], { validate: true });
 *
 * // With transaction
 * await withTransaction(async (t) => {
 *   const users = await bulkCreateUsers([
 *     { username: 'user1', email: 'user1@example.com', password: 'pass123' },
 *     { username: 'user2', email: 'user2@example.com', password: 'pass456' }
 *   ], { validate: true }, t);
 *   // Other operations...
 * });
 * ```
 */
export const bulkCreateUsers = async (
  dataArray: Partial<UserAttributes>[],
  options?: BulkCreateOptions,
  transaction?: Transaction
): Promise<ApiResponse<UserModel[]>> => {
  try {
    // Ensure all users are created as unverified
    const normalizedData = dataArray.map((user) => ({
      ...user,
      verified: false,
    }));

    // Validate for duplicates within input array and against database
    await validateBulkUserData(normalizedData, transaction);

    const bulkCreateOptions: BulkCreateOptions = options || {};
    if (transaction) {
      bulkCreateOptions.transaction = transaction;
    }

    const records = await UserModel.bulkCreate(
      normalizedData as any[],
      bulkCreateOptions
    );

    return {
      success: true,
      data: records,
      message: 'Users created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for Users', error.message);
    }
    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      throw new ValidationError(
        'Validation failed for Users',
        'One or more usernames or emails already exist'
      );
    }
    throw new ValidationError(
      'Error bulk creating Users',
      error instanceof Error ? error.message : String(error)
    );
  }
};
