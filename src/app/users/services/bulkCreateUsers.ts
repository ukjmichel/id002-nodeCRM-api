/**
 * Bulk Create Users Service
 * Creates multiple user records at once
 */

import { ValidationError } from '../../../core/errors/index.js';
import {ApiResponse, BulkCreateOptions } from "../../../core/interfaces/index.js";
import { UserAttributes } from '../interfaces/user.interface.js';
import { UserModel } from '../models/user.model.js';





/**
 * Bulk create users
 *
 * @param dataArray - Array of user data to create
 * @param options - Sequelize bulk create options
 * @returns Created user records
 * @throws {ValidationError} When bulk creation fails
 *
 * @example
 * ```typescript
 * const users = await bulkCreateUsers([
 *   { username: 'user1', email: 'user1@example.com', ... },
 *   { username: 'user2', email: 'user2@example.com', ... }
 * ], { validate: true });
 * ```
 */
export const bulkCreateUsers = async (
  dataArray: Partial<UserAttributes>[],
  options?: BulkCreateOptions
): Promise<ApiResponse<UserModel[]>> => {
  try {
    const records = await UserModel.bulkCreate(dataArray as any[], options);
    return {
      success: true,
      data: records,
      message: 'Users created successfully',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError('Validation failed for Users', error.message);
    }
    throw new ValidationError(
      'Error bulk creating Users',
      error instanceof Error ? error.message : String(error)
    );
  }
};
