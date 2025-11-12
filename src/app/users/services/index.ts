/**
 * =============================================================================
 * User Service - Main Export
 * =============================================================================
 * Combines all user service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import {
  ApiResponse,
  FindOneOptions,
  ICrudService,
} from '../../../core/utils/crudServiceGenerator';
import { UserAttributes } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { bulkCreateUsers } from './bulkCreateUsers';
import { countUsers } from './countUsers';
import { createUser } from './createUser';
import { deleteUser } from './deleteUser';
import { findAllUsers } from './findAllUsers';
import { findOneUser } from './findOneUser';
import { findUnverifiedUsers } from './findUnverifiedUsers';
import { findUserByEmail } from './findUserByEmail';
import { findUserById } from './findUserById';
import { findUserByUsername } from './findUserByUsername';
import { findVerifiedUsers } from './findVerifiedUsers';
import { unverifyUser } from './unverifyUser';
import { updatePassword } from './updatePassword';
import { updateUser } from './updateUser';
import { validateUserPassword } from './validateUserPassword';
import { verifyUser } from './verifyUser';

// Import CRUD operations

/**
 * Extended User Service Interface
 * Includes standard CRUD operations plus user-specific methods
 */
export interface IUserService extends ICrudService<UserModel> {
  findByEmail(
    email: string,
    options?: FindOneOptions
  ): Promise<ApiResponse<UserModel>>;
  findByUsername(
    username: string,
    options?: FindOneOptions
  ): Promise<ApiResponse<UserModel>>;
  validateUserPassword(
    userId: string,
    password: string
  ): Promise<ApiResponse<boolean>>;
  verifyUser(userId: string): Promise<ApiResponse<UserModel>>;
  unverifyUser(userId: string): Promise<ApiResponse<UserModel>>;
  findVerifiedUsers(): Promise<ApiResponse<UserModel[]>>;
  findUnverifiedUsers(): Promise<ApiResponse<UserModel[]>>;
  updatePassword(
    userId: string,
    newPassword: string
  ): Promise<ApiResponse<UserModel>>;
}

/**
 * User Service
 * Provides all CRUD operations and user-specific business logic
 *
 * @example
 * ```typescript
 * import { userService } from './services/user';
 *
 * // Create a new user
 * const newUser = await userService.create({
 *   username: 'johndoe',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   password: 'securePassword123'
 * });
 *
 * // Find user by email
 * const user = await userService.findByEmail('john@example.com');
 *
 * // Validate password
 * const isValid = await userService.validateUserPassword(
 *   user.data.userId,
 *   'securePassword123'
 * );
 *
 * // Verify user
 * await userService.verifyUser(user.data.userId);
 *
 * // Get all verified users
 * const verifiedUsers = await userService.findVerifiedUsers();
 * ```
 */
export const userService: IUserService = {
  // CRUD Operations
  create: createUser,
  findAll: findAllUsers,
  findById: findUserById,
  findOne: findOneUser,
  update: updateUser,
  delete: deleteUser,
  bulkCreate: bulkCreateUsers,
  count: countUsers,

  // User-specific Operations
  findByEmail: findUserByEmail,
  findByUsername: findUserByUsername,
  validateUserPassword: validateUserPassword,
  verifyUser: verifyUser,
  unverifyUser: unverifyUser,
  findVerifiedUsers: findVerifiedUsers,
  findUnverifiedUsers: findUnverifiedUsers,
  updatePassword: updatePassword,
};

export default userService;

// Re-export individual methods for direct imports if needed
export {
  // CRUD
  createUser,
  findAllUsers,
  findUserById,
  findOneUser,
  updateUser,
  deleteUser,
  bulkCreateUsers,
  countUsers,
  // User-specific
  findUserByEmail,
  findUserByUsername,
  validateUserPassword,
  verifyUser,
  unverifyUser,
  findVerifiedUsers,
  findUnverifiedUsers,
  updatePassword,
};
