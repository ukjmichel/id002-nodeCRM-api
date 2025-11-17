/**
 * =============================================================================
 * Role Service - Main Export
 * =============================================================================
 * Combines all role service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import {
  ApiResponse,
  FindOneOptions,
  ICrudService,
} from '../../../core/utils/crudServiceGenerator';
import { RoleModel, RoleType } from '../models/role.model';
import { activateRole } from './activateRole';
import { bulkCreateRoles } from './bulkCreateRoles';
import { changeRoleType } from './changeRoleType';
import { countRoles } from './countRoles';
import { createRole } from './createRole';

import { deactivateRole } from './deactivateRole';
import { deleteRole } from './deleteRole';
import { findActiveRoles } from './findActiveRoles';

import { findAllRoles } from './findAllRoles';
import { findInactiveRoles } from './findInactiveRoles';
import { findOneRole } from './findOneRole';
import { findRoleById } from './findRoleById';

import { findRolesByType } from './findRolesByType';
import { updateRole } from './updateRole';

/**
 * Extended Role Service Interface
 * Includes standard CRUD operations plus role-specific methods
 */
export interface IRoleService extends ICrudService<RoleModel> {
  findByType(
    roleType: RoleType,
    includeInactive?: boolean
  ): Promise<ApiResponse<RoleModel[]>>;
  findActive(): Promise<ApiResponse<RoleModel[]>>;
  findInactive(): Promise<ApiResponse<RoleModel[]>>;
  activate(roleId: string): Promise<ApiResponse<RoleModel>>;
  deactivate(roleId: string): Promise<ApiResponse<RoleModel>>;
  changeType(
    roleId: string,
    newRoleType: RoleType
  ): Promise<ApiResponse<RoleModel>>;
}

/**
 * Role Service
 * Provides all CRUD operations and role-specific business logic
 *
 * @example
 * ```typescript
 * import { roleService, RoleType } from './services/role';
 *
 * // Create a new role
 * const newRole = await roleService.create({
 *   userId: 'user-uuid-here',
 *   roleType: RoleType.CUSTOMER,
 *   isActive: true
 * });
 *
 * // Find role by user ID
 * const role = await roleService.findByUserId('user-uuid-here');
 *
 * // Get all administrators
 * const admins = await roleService.findByType(RoleType.ADMINISTRATOR);
 *
 * // Change role type
 * await roleService.changeType(role.data.roleId, RoleType.BUSINESS);
 *
 * // Deactivate role
 * await roleService.deactivate(role.data.roleId);
 *
 * // Get all active roles
 * const activeRoles = await roleService.findActive();
 * ```
 */
export const roleService: IRoleService = {
  // CRUD Operations
  create: createRole,
  findAll: findAllRoles,
  findById: findRoleById,
  findOne: findOneRole,
  update: updateRole,
  delete: deleteRole,
  bulkCreate: bulkCreateRoles,
  count: countRoles,

  // Role-specific Operations,
  findByType: findRolesByType,
  findActive: findActiveRoles,
  findInactive: findInactiveRoles,
  activate: activateRole,
  deactivate: deactivateRole,
  changeType: changeRoleType,
};

export default roleService;

// Re-export individual methods for direct imports if needed
export {
  // CRUD
  createRole,
  findAllRoles,
  findRoleById,
  findOneRole,
  updateRole,
  deleteRole,
  bulkCreateRoles,
  countRoles,
  // Role-specific
  findRolesByType,
  findActiveRoles,
  findInactiveRoles,
  activateRole,
  deactivateRole,
  changeRoleType,
};

// Re-export RoleType enum for convenience
export { RoleType } from '../models/role.model';
