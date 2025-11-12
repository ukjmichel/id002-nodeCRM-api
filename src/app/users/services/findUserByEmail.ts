/**
 * Find User By Email Service
 * Finds a user by their email address
 */

import { NotFoundError } from '../../../core/errors/index.js';
import { ApiResponse, FindOneOptions, WhereOptions } from "../../../core/interfaces";

import { UserAttributes } from '../interfaces/user.interface.js';
import { UserModel } from '../models/user.model.js';
import { findOneUser } from "./findOneUser.js";



/**
 * Find a user by email address
 * Email is automatically normalized to lowercase
 *
 * @param email - User's email address
 * @param options - Query options (include)
 * @returns User record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const user = await findUserByEmail('john@example.com');
 * console.log(user.data.username);
 * ```
 */
export const findUserByEmail = async (
  email: string,
  options: FindOneOptions = {}
): Promise<ApiResponse<UserModel>> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const where: WhereOptions<UserAttributes> = { email: normalizedEmail };

    return await findOneUser(where, options);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(`User with email ${email} not found`);
    }
    throw error;
  }
};
