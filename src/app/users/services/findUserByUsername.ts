/**
 * Find User By Username Service
 * Finds a user by their username
 */

import { NotFoundError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  FindOneOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';

import { UserAttributes } from '../interfaces/user.interface.js';
import { UserModel } from '../models/user.model.js';
import { findOneUser } from './findOneUser.js';

/**
 * Find a user by username
 * Username is automatically normalized to lowercase
 *
 * @param username - User's username
 * @param options - Query options (include)
 * @returns User record
 * @throws {NotFoundError} When user is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const user = await findUserByUsername('johndoe');
 * console.log(user.data.email);
 * ```
 */
export const findUserByUsername = async (
  username: string,
  options: FindOneOptions = {}
): Promise<ApiResponse<UserModel>> => {
  try {
    const normalizedUsername = username.trim().toLowerCase();
    const where: WhereOptions<UserAttributes> = {
      username: normalizedUsername,
    };

    return await findOneUser(where, options);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(`User with username ${username} not found`);
    }
    throw error;
  }
};
